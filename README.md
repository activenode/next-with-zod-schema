# next-with-zod-schema

## Usage

- `npm i zod && npm i next-with-zod-schema`
- Go to your `api/` file in Next e.g. `api/test.js`

Do this:

```
const BODY_SCHEMA = z.object({
  email: z.string().email(),
  type: z.enum(['normal', 'unnormal']),
});

export default withSchema(BODY_SCHEMA, async function YourApiRoute(req, res, body) {
    // if you reach this point the body data is already validated and it's also perfectly typed for TypeScript!

    console.log('the email was perfect', body.email);
    console.log('The type was perfect as well', body.type);
})
```
