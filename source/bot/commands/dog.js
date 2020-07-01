/**
  * Dog command
  * outputs a random dog image from https://dog.ceo
  */

import fetch from "node-fetch"

export const id           = "dog"
export const category     = "fun"
export const services     = ["discord", "twitchIRC"]
export const args         = [[]]
export const isRestricted = false

export default async function dogCmd(message) {

  try {
    
    const data = await fetch("https://dog.ceo/api/breeds/image/random").then(res => res.json())

    message.output = data.message

  } catch (err) {

    message.output = "https://i.imgur.com/9oPUiCu.gif"
  
  }

  message.isFile = true

  return message

}