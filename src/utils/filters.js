import {format} from "date-fns";

export function formatDate(arr) {
  return format(arr, 'dd/MM/yyyy HH:mm')
}

export function pluralize() {
  if (!arguments[0] || arguments[0] > 1) {
    return `${arguments[0]} ${arguments[1]}s`
  }

  return `${arguments[0]} ${arguments[1]}`
}
