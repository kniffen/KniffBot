/**
  * Dog command
  * outputs a random dog image from https://dog.ceo
  */

import fetch from "node-fetch"

export const id       = "dog"
export const category = "fun"
export const services = ["discord", "twitchIRC"]
export const args     = [[]]

export default async function catCmd(message) {

  const data = await fetch("https://dog.ceo/api/breeds/image/random")?.then(res => res.json())

  message.output = data?.message || "https://i.imgur.com/9oPUiCu.gif"
  message.isFile = true

  return message

}