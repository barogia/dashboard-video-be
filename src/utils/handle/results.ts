interface PromiseResult<T> {
  status: 'rejected' | 'fulfilled';
  value?: T;
  reason?: any;
}

const fetchUser = async () => {
  return '';
};
const fetchProduct = async () => {
  return '';
};

const handle = (error) => {
  // write your error handler here
};

function handleResults<T>(results: PromiseResult<T>[]) {
  const errors = results
    .filter((result) => result.status === 'rejected')
    .map((result) => result.reason);

  if (errors.length > 0) {
    throw new Error(`Multiple errors: ${errors}`);
  }

  return results.map((result) => result.value);
}

// for example

async function getPageData() {
  const results = await Promise.allSettled([fetchUser(), fetchProduct()]);

  try {
    const [user, product] = handleResults(results);

    return { user, product };
  } catch (err) {
    for (const error of err.errors) {
      handle(error);
    }
    //
  }
}
