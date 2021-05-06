import { Message } from '../../src/types'

export default function createFakeMessage(input: any = {}): Message {

  const fakeMessage: Message = {
    service: input.service || 'foobar',
    input: input.input || 'default input',
    timestamp: input.timestamp || 0,
    isBot: input.isBot || false,
    isReply: input.isReply || false,
    isFile: input.isFile || false,
    isMentioned: input.isMentioned || false,
    author: input.author || {id: 'authorID', name: 'AuthorName', isAuthorized: false},
    original: input.original || {},
  }

  if ( input.output ) fakeMessage.output = input.output
  if ( input.command ) fakeMessage.command = input.command

  return fakeMessage

}