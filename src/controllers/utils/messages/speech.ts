enum ErrorForSpeech {
  MP3_ERROR = 'There was an error while trying to process the audio',
  TRANSCRIBE = 'There was an error while trying to convert the audio to text'
}

enum MessageForSpeech {
}

export { ErrorForSpeech as EFS, MessageForSpeech as MFS }
