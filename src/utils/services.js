export const customFetch = async (url, options) => {
  const res = await fetch(`https://hammerhead-app-wjiwm.ondigitalocean.app/${url}`, {
    ...options,
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'iwfujnejker8dv932haudh224r5jjsfij'
    }
  });
  const json = await res.json();
  return json;
};