# Loadify Market — Enterprise v6
Full-stack marketplace scaffold (Netlify + Stripe + Supabase + SendGrid).

**Deploy flow**
1) Push this folder to a new GitHub repo.
2) Netlify → New site from Git → connect repo.
3) Netlify → Site settings → Environment variables → copy from `.env.example`.
4) Supabase → run `db/schema.sql` once.
5) Stripe → add webhook for `/.netlify/functions/stripe-webhook` (events: checkout.session.completed).
6) Deploy.
