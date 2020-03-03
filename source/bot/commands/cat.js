/**
  * Cat command
  * outputs a random cat image from http://random.cat
  */

import fetch from "node-fetch"

export const id       = "cat"
export const category = "fun"
export const services = ["discord", "twitchIRC"]
export const args     = [[]]

export default async function catCmd(message) {

  const data = await fetch("http://aws.random.cat/meow")?.then(res => res.json())

  message.output = data?.file || "http://i.imgur.com/Bai6JTL.jpg"
  message.isFile = true

  return message

}