CREATE TABLE public.products (
	id uuid DEFAULT uuid_generate_v4(),
	title text NOT NULL,
	description text,
	price integer,
	PRIMARY KEY (id)
);
