const ctx: Worker = self as any

console.log("Hello World")

// Post data to parent thread
// ctx.postMessage({ foo: "foo" })

// // Respond to message from parent thread
// ctx.addEventListener("message", event => console.log(event))
