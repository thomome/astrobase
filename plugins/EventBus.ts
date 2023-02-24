import mitt from 'mitt'

interface User {
  name: string
}

type ApplicationEvents = {
  // translates to: 
  // user:registered -> event name
  // User -> type as payload
  'user:registered': User
  'user:deleted': User
};

export default defineNuxtPlugin(() => {
  // Then we just inform mitt about our event types
  const emitter = mitt<ApplicationEvents>()

  return {
    provide: {
      event: emitter.emit, // Will emit an event
      listen: emitter.on // Will register a listener for an event
    }
  }
})