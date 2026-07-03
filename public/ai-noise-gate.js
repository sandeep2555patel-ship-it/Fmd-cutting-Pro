class AISemanticIsolation extends AudioWorkletProcessor {
  constructor() {
    super();
    this.vocalEnvelope = 0;
    this.noiseEnvelope = 0;
    this.attack = 0.99; // slower attack for smoother transitions
    this.release = 0.999; 
    
    this.x1 = 0; this.x2 = 0;
    this.y1 = 0; this.y2 = 0;
    this.gain = 1; // track gain state to smooth it out further
  }

  static get parameterDescriptors() {
    return [
      { name: 'vocalVolume', defaultValue: 1.0, minValue: 0, maxValue: 2.0 },
      { name: 'backgroundVolume', defaultValue: 0.0, minValue: -2.0, maxValue: 2.0 },
      { name: 'aiIsolation', defaultValue: 0.0, minValue: 0.0, maxValue: 1.0 }
    ];
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    if (!input || !input.length || !output || !output.length) return true;

    const vVol = parameters.vocalVolume.length > 1 ? parameters.vocalVolume[0] : parameters.vocalVolume;
    const nVol = parameters.backgroundVolume.length > 1 ? parameters.backgroundVolume[0] : parameters.backgroundVolume;
    const aiIso = parameters.aiIsolation.length > 1 ? parameters.aiIsolation[0] : parameters.aiIsolation;

    for (let channel = 0; channel < input.length; channel++) {
      const inputChannel = input[channel];
      const outputChannel = output[channel];
      
      for (let i = 0; i < inputChannel.length; i++) {
        const sample = inputChannel[i];
        
        // Bandpass to focus on human speech frequencies (approx 300Hz-3000Hz)
        const x = sample;
        const y = 0.1 * x - 0.1 * this.x2 + 1.6 * this.y1 - 0.75 * this.y2;
        this.x2 = this.x1; this.x1 = x;
        this.y2 = this.y1; this.y1 = y;
        
        const vocalEnergy = Math.abs(y);
        
        if (vocalEnergy > this.vocalEnvelope) {
          this.vocalEnvelope = this.attack * this.vocalEnvelope + (1 - this.attack) * vocalEnergy;
        } else {
          this.vocalEnvelope = this.release * this.vocalEnvelope + (1 - this.release) * vocalEnergy;
        }
        
        // Semantic AI Isolation Logic
        let vocalThresh = 0.003; 
        if (aiIso > 0.5) {
          vocalThresh = 0.008; // stricter for AI semantic catching
        }
        
        let mix = 0;
        if (this.vocalEnvelope > vocalThresh) {
          mix = 1.0;
        } else {
          mix = this.vocalEnvelope / vocalThresh;
          mix = mix * mix; // smooth transition
        }
        
        let bgVol = nVol;
        let vocalVol = vVol;

        if (nVol < 0) {
           // Negative nVol means we want to aggressively mute the background.
           // nVol goes from 0 to -2.0.
           // If nVol is -2.0, bgVol should be 0.
           // We scale the background volume down smoothly.
           bgVol = 0;
           
           // And if AI semantic is on, we aggressively cut the 'mix' curve so that only strong vocals survive
           const reduction = Math.abs(nVol) / 2.0; // 0 to 1
           if (aiIso > 0.5) {
              mix = mix * Math.pow(mix, reduction * 2); 
           } else {
              mix = mix * Math.pow(mix, reduction);
           }
        }
        
        // Smooth out the gain target
        const targetGain = (mix * vocalVol) + ((1 - mix) * bgVol);
        
        // Low pass filter the gain to completely eliminate "khar khar" crackling
        this.gain = 0.999 * this.gain + 0.001 * targetGain;
        
        outputChannel[i] = sample * this.gain;
      }
    }
    
    return true;
  }
}

registerProcessor('ai-noise-gate', AISemanticIsolation);
