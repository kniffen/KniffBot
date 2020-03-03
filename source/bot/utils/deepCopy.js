/**
  * Copy objects and arrays deeply
  */

export default function deepCopy(input = {}, output = {}) {

  copyProps(input, output)

  return output

}

function copyProps(input, output) {
  for (const key in input) {
    if (Array.isArray(input[key])) {
      if (!output[key]) output[key] = new Array()
      copyProps(input[key], output[key])
    } else if (typeof input[key] == "object") {
      if (!output[key]) output[key] = new Object()
      copyProps(input[key], output[key])
    } else if (!output[key]) {
      output[key] = input[key]      
    }
  }
}