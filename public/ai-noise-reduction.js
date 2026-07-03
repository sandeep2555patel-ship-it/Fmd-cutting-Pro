class AINoiseReductionProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.vocalVolume = 1.0;
    this.backgroundVolume = 0.0;
  }

  static get parameterDescriptors() {
    return [
      { name: 'vocalVolume', defaultValue: 1.0, minValue: 0, maxValue: 2.0 },
      { name: 'backgroundVolume', defaultValue: 0.0, minValue: 0, maxValue: 2.0 }
    ];
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    
    if (!input || !input.length || !output || !output.length) return true;

    const vVol = parameters.vocalVolume.length > 1 ? parameters.vocalVolume[0] : parameters.vocalVolume;
    const nVol = parameters.backgroundVolume.length > 1 ? parameters.backgroundVolume[0] : parameters.backgroundVolume;

    for (let channel = 0; channel < input.length; channel++) {
      const inputChannel = input[channel];
      const outputChannel = output[channel];
      
      let energy = 0;
      let zeroCrossings = 0;
      let prevSample = 0;

      for (let i = 0; i < inputChannel.length; i++) {
        const sample = inputChannel[i];
        energy += sample * sample;
        if ((sample >= 0 && prevSample < 0) || (sample < 0 && prevSample >= 0)) {
          zeroCrossings++;
        }
        prevSample = sample;
      }
      
      energy = energy / inputChannel.length;
      
      const isVoice = (zeroCrossings > 5 && zeroCrossings < 60) && (energy > 0.0001);
      
      let targetGain = isVoice ? vVol : nVol;
      
      for (let i = 0; i < inputChannel.length; i++) {
        outputChannel[i] = inputChannel[i] * targetGain;
      }
    }
    
    return true;
  }
}

registerProcessor('ai-noise-reduction', AINoiseReductionProcessor);
