/**
  * Cat command
  * outputs a random cat image from http://random.cat
  */

import fetch from "node-fetch"

export const id           = "cat"
export const category     = "fun"
export const services     = ["discord", "twitchIRC"]
export const args         = [[]]
export const isRestricted = false

export default async function catCmd(message) {

  try {
    
    const data = await fetch("http://aws.random.cat/meow").then(res => res.json())

    message.output = data.file

  } catch (err) {

    message.output = "http://i.imgur.com/Bai6JTL.jpg"
  
  }

  message.isFile = true

  return message

}