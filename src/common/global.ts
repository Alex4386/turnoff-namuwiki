const basePath = 'https://raw.githubusercontent.com/Alex4386/turnoff-namuwiki/main/';

type FetchParams = Parameters<typeof fetch>;

function getRepoURL(path: string): string {
  return basePath + path;
}

export function fetchRepo(input: FetchParams[0], init?: FetchParams[1] & { repo: boolean }): ReturnType<typeof fetch> {
  const isRepo = init?.repo || false;
  let url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  if (isRepo) {
    url = getRepoURL(url);
  }

  let newInput: FetchParams[0];
  // if it is a Request object, we need to copy the Request object
  if (input instanceof Request) {
    newInput = new Request(input, {
      body: input.body,
      headers: input.headers,
      method: input.method,
      mode: input.mode,
      credentials: input.credentials,
      cache: input.cache,
      redirect: input.redirect,
      referrer: input.referrer,
      referrerPolicy: input.referrerPolicy,
      integrity: input.integrity,
      keepalive: input.keepalive,
      signal: input.signal,
    });
  } else {
    if (typeof input === 'string') {
      newInput = url;
    } else {
      newInput = new URL(url);
    }
  }

  return fetch(newInput, init);
}
