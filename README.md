# Validate API Requests in NextJS before they reach you

The basis is the validation library [`zod`](https://github.com/colinhacks/zod) .

`withSchema` works both with `GET` and `POST` requests so you don't have to worry about `query` vs `body` params.
This library detects the mode and will always validate the correct one.

## Usage

- `npm i zod && npm i next-with-zod-schema`
- Go to your `api/` file in Next e.g. `api/test.js`

Do this (default is `POST`):

```ts
const BODY_SCHEMA = z.object({
  email: z.string().email(),
  type: z.enum(["normal", "unnormal"]),
});

export default withSchema(
  BODY_SCHEMA,
  async function YourApiRoute(req, res, body) {
    // if you reach this point the body data is already validated and it's also perfectly typed for TypeScript!

    console.log("the email was perfect", body.email);
    console.log("The type was perfect as well", body.type);
  }
);
```

### Usage with `GET`

```ts
export default withSchema(BODY_SCHEMA, YOUR_FUNCTION, "GET");
```
