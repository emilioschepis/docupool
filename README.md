# DocuPool

DocuPool is a platform where you can share your documents and notes, obtaining tokens that you can then use to unlock other people's content.

This project was created using [Supabase](https://supabase.com) as part of the [Bring the Func](https://www.madewithsupabase.com/bring-the-func) Hackathon of April 2022.

DocuPool is hosted on Vercel at [https://docupool.vercel.app/](https://docupool.vercel.app/). Try [searching for "fables"](https://docupool.vercel.app/app/search?q=fables) to see some sample documents!

Built with ❤️ by

- Emilio — [GitHub](https://github.com/emilioschepis) · [Twitter](https://twitter.com/emilioschepis)
- Federico — no GitHub or Twitter yet

## Edge Functions

Edge Functions are the main focus of this project! They are used wherever we need a secure environment to run our code on.

For example, our [admin panel](https://github.com/emilioschepis/docupool/tree/main/pages/admin) uses Edge Functions to approve or reject users' submissions. The business logic for handling the number of coins is directly coded into the function.

Non-admin users interact with functions whenever they unlock a new document!

- [Approve document](https://github.com/emilioschepis/docupool/blob/main/supabase/functions/approve/index.ts)
- [Reject document](https://github.com/emilioschepis/docupool/blob/main/supabase/functions/reject/index.ts)
- [Unlock document](https://github.com/emilioschepis/docupool/blob/main/supabase/functions/unlock/index.ts)

## Technologies

This website is built using Supabase, [Next.js](https://nextjs.org/) and [Chakra UI](https://chakra-ui.com/), and it is hosted on [Vercel](https://vercel.com/).

### Supabase

DocuPool uses multiple Supabase features, now including [Edge Functions](https://supabase.com/blog/2022/03/31/supabase-edge-functions)

- **Supabase Auth**: used to let users sign in or create accounts
- **Supabase Database**: used as database to keep data about documents, coins, unlocks, etc.
- **Supabase Storage**: used to store the actual documents that can be unlocked
- **Supabase Edge Functions**: used to perform secure operations on the edge, such as unlocking a new document

This is the current database schema:

![DocuPool Database Schema](https://user-images.githubusercontent.com/16031715/162631405-5d2acb3b-c046-4de1-912c-1062a24d29c8.png)
(made with [Supabase Schema](https://www.madewithsupabase.com/p/supabase-schema))
