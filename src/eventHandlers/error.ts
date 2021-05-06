export default function errorEventHandler(serviceName: string = '', error: (Error | undefined) = undefined) {

  if ( !error ) return

  const label = serviceName ? `${serviceName.toUpperCase()}:` : 'UNKNOWN:'

  console.log(`${label} ${error.message}`)

}