--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: emersonkelly
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    message text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    user_id integer
);


ALTER TABLE public.messages OWNER TO emersonkelly;

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: emersonkelly
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.messages_id_seq OWNER TO emersonkelly;

--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: emersonkelly
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: usernames; Type: TABLE; Schema: public; Owner: emersonkelly
--

CREATE TABLE public.usernames (
    id integer NOT NULL,
    username character varying(255) NOT NULL
);


ALTER TABLE public.usernames OWNER TO emersonkelly;

--
-- Name: usernames_id_seq; Type: SEQUENCE; Schema: public; Owner: emersonkelly
--

CREATE SEQUENCE public.usernames_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.usernames_id_seq OWNER TO emersonkelly;

--
-- Name: usernames_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: emersonkelly
--

ALTER SEQUENCE public.usernames_id_seq OWNED BY public.usernames.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: emersonkelly
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255),
    password character varying(255)
);


ALTER TABLE public.users OWNER TO emersonkelly;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: emersonkelly
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: emersonkelly
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: usernames id; Type: DEFAULT; Schema: public; Owner: emersonkelly
--

ALTER TABLE ONLY public.usernames ALTER COLUMN id SET DEFAULT nextval('public.usernames_id_seq'::regclass);


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: emersonkelly
--

COPY public.messages (id, message, created_at, user_id) FROM stdin;
1	test	2025-04-23 22:31:10.684859	1
\.


--
-- Data for Name: usernames; Type: TABLE DATA; Schema: public; Owner: emersonkelly
--

COPY public.usernames (id, username) FROM stdin;
1	Emerson
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: emersonkelly
--

COPY public.users (id, username, password) FROM stdin;
1	emerson4945	4945
2	emerson4945	1234
3	emerson4945	1234
\.


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: emersonkelly
--

SELECT pg_catalog.setval('public.messages_id_seq', 1, true);


--
-- Name: usernames_id_seq; Type: SEQUENCE SET; Schema: public; Owner: emersonkelly
--

SELECT pg_catalog.setval('public.usernames_id_seq', 1, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: emersonkelly
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: emersonkelly
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: usernames usernames_pkey; Type: CONSTRAINT; Schema: public; Owner: emersonkelly
--

ALTER TABLE ONLY public.usernames
    ADD CONSTRAINT usernames_pkey PRIMARY KEY (id);


--
-- Name: usernames usernames_username_key; Type: CONSTRAINT; Schema: public; Owner: emersonkelly
--

ALTER TABLE ONLY public.usernames
    ADD CONSTRAINT usernames_username_key UNIQUE (username);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: emersonkelly
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: messages messages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: emersonkelly
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.usernames(id);


--
-- PostgreSQL database dump complete
--

