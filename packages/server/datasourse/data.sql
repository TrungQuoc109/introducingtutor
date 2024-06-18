--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.3 (Ubuntu 16.3-1.pgdg22.04+1)

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

ALTER TABLE IF EXISTS ONLY public.tutor DROP CONSTRAINT IF EXISTS tutor_user_id_fk;
ALTER TABLE IF EXISTS ONLY public.tutor_subject_map DROP CONSTRAINT IF EXISTS tutor_subject_map_tutor_id_fk;
ALTER TABLE IF EXISTS ONLY public.tutor_subject_map DROP CONSTRAINT IF EXISTS tutor_subject_map_subject_id_fk;
ALTER TABLE IF EXISTS ONLY public.teaching_subject DROP CONSTRAINT IF EXISTS teaching_subject_tutor_id_fk;
ALTER TABLE IF EXISTS ONLY public.teaching_subject DROP CONSTRAINT IF EXISTS teaching_subject_subject_id_fk;
ALTER TABLE IF EXISTS ONLY public.student DROP CONSTRAINT IF EXISTS student_user_id_fk;
ALTER TABLE IF EXISTS ONLY public.student_teaching_subject_map DROP CONSTRAINT IF EXISTS student_teaching_subject_map_student_id_fk;
ALTER TABLE IF EXISTS ONLY public.student_teaching_subject_map DROP CONSTRAINT IF EXISTS student_class_map_class_id_fk;
ALTER TABLE IF EXISTS ONLY public.salary DROP CONSTRAINT IF EXISTS salary_tutor_id_fk;
ALTER TABLE IF EXISTS ONLY public.lession DROP CONSTRAINT IF EXISTS lession_class_id_fk;
ALTER TABLE IF EXISTS ONLY public.document DROP CONSTRAINT IF EXISTS document_tutor_id_fk;
DROP INDEX IF EXISTS public.users_username_uindex;
DROP INDEX IF EXISTS public.salary_tutor_id_uindex;
DROP INDEX IF EXISTS public.document_lesson_id_instructor_id_uindex;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pk;
ALTER TABLE IF EXISTS ONLY public.tutor_subject_map DROP CONSTRAINT IF EXISTS tutor_subject_map_pk;
ALTER TABLE IF EXISTS ONLY public.tutor DROP CONSTRAINT IF EXISTS tutor_pk;
ALTER TABLE IF EXISTS ONLY public.teaching_subject DROP CONSTRAINT IF EXISTS teaching_subject_pk;
ALTER TABLE IF EXISTS ONLY public.subject DROP CONSTRAINT IF EXISTS subject_pk;
ALTER TABLE IF EXISTS ONLY public.student_teaching_subject_map DROP CONSTRAINT IF EXISTS student_teaching_subject_map_pk;
ALTER TABLE IF EXISTS ONLY public.student DROP CONSTRAINT IF EXISTS student_pk;
ALTER TABLE IF EXISTS ONLY public.salary DROP CONSTRAINT IF EXISTS salary_pk;
ALTER TABLE IF EXISTS ONLY public.otp DROP CONSTRAINT IF EXISTS otp_pk;
ALTER TABLE IF EXISTS ONLY public.lession DROP CONSTRAINT IF EXISTS lession_pk;
ALTER TABLE IF EXISTS ONLY public.document DROP CONSTRAINT IF EXISTS document_pk;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.tutor_subject_map;
DROP TABLE IF EXISTS public.tutor;
DROP TABLE IF EXISTS public.teaching_subject;
DROP TABLE IF EXISTS public.subject;
DROP TABLE IF EXISTS public.student_teaching_subject_map;
DROP TABLE IF EXISTS public.student;
DROP TABLE IF EXISTS public.salary;
DROP TABLE IF EXISTS public.otp;
DROP TABLE IF EXISTS public.lession;
DROP TABLE IF EXISTS public.document;
DROP EXTENSION IF EXISTS "uuid-ossp";
-- *not* dropping schema, since initdb creates it
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: document; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.document (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    instructor_id uuid NOT NULL,
    url text NOT NULL,
    lesson_id uuid DEFAULT public.uuid_generate_v4() NOT NULL
);


ALTER TABLE public.document OWNER TO postgres;

--
-- Name: lession; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lession (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL,
    start_time time without time zone NOT NULL,
    duration integer NOT NULL,
    teaching_subject_id uuid NOT NULL,
    title character varying(100) NOT NULL
);


ALTER TABLE public.lession OWNER TO postgres;

--
-- Name: otp; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.otp (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    code character(6) NOT NULL,
    email character varying(100) NOT NULL,
    create_at timestamp without time zone DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Ho_Chi_Minh'::text) NOT NULL
);


ALTER TABLE public.otp OWNER TO postgres;

--
-- Name: salary; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.salary (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    base_salary integer NOT NULL,
    tutor_id uuid NOT NULL,
    decution integer DEFAULT 20 NOT NULL,
    total_salary integer NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL,
    status integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.salary OWNER TO postgres;

--
-- Name: student; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    grade_level integer NOT NULL,
    user_id uuid NOT NULL
);


ALTER TABLE public.student OWNER TO postgres;

--
-- Name: student_teaching_subject_map; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_teaching_subject_map (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    student_id uuid NOT NULL,
    teaching_subject_id uuid NOT NULL
);


ALTER TABLE public.student_teaching_subject_map OWNER TO postgres;

--
-- Name: subject; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subject (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.subject OWNER TO postgres;

--
-- Name: teaching_subject; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teaching_subject (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(50) NOT NULL,
    instructor_id uuid NOT NULL,
    subject_id uuid NOT NULL,
    description text,
    start_date date DEFAULT CURRENT_DATE NOT NULL,
    number_of_sessions integer NOT NULL,
    location character varying(100) NOT NULL,
    price integer NOT NULL,
    student_count integer NOT NULL,
    status integer DEFAULT 1 NOT NULL,
    grade_level integer NOT NULL
);


ALTER TABLE public.teaching_subject OWNER TO postgres;

--
-- Name: tutor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tutor (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    education character varying(50) NOT NULL,
    experience text NOT NULL,
    user_id uuid NOT NULL
);


ALTER TABLE public.tutor OWNER TO postgres;

--
-- Name: tutor_subject_map; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tutor_subject_map (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tutor_id uuid NOT NULL,
    subject_id uuid NOT NULL
);


ALTER TABLE public.tutor_subject_map OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    phone_number character varying(12) NOT NULL,
    age integer NOT NULL,
    username character varying(50) NOT NULL,
    password text NOT NULL,
    role integer DEFAULT 2 NOT NULL,
    status integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: document; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: lession; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: otp; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: salary; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.student VALUES ('eda6e1fa-33dd-430a-887b-118443ef8b76', 4, '1bc9c112-d58c-4766-b879-80b2689d58d8');
INSERT INTO public.student VALUES ('94c81f81-bb39-4c75-a42f-afbd5ef6ff40', 2, 'ec0c06d5-295c-44fe-bc86-2b79d4e67c42');


--
-- Data for Name: student_teaching_subject_map; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: subject; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.subject VALUES ('50899f5e-0ee7-43af-a448-701d3515b03b', 'Toán');
INSERT INTO public.subject VALUES ('2dfba33f-f110-45f0-9b9e-bc4fd19145bd', 'Vật lý');
INSERT INTO public.subject VALUES ('d3c6d61b-5b6f-4c45-a032-78f60f4aebbd', 'Hóa học');
INSERT INTO public.subject VALUES ('c10035a4-f18e-4d6a-89ee-1d42ceb24573', 'Tiếng Anh');
INSERT INTO public.subject VALUES ('ed55892a-5892-47a3-af1e-4defac6c1bd4', 'Sinh học');


--
-- Data for Name: teaching_subject; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: tutor; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tutor VALUES ('314b68d8-a6cb-4221-bbde-2ce15ca2e2cd', 'Sinh viên', 'Sinh viên năm 4', 'af88cb3a-1e26-40f4-abd7-800cbddd7be2');
INSERT INTO public.tutor VALUES ('4636d38c-338c-449d-917c-dab18f1996f7', 'Sinh viên', 'Sinh viên năm 4', 'e10e6281-91ed-499e-b83a-58dd66865d26');
INSERT INTO public.tutor VALUES ('cc161149-7900-4d7d-b73c-e3310adcbbc4', 'Sinh viên', 'Sinh viên năm 4', '736f42e1-ad37-446e-bc07-6bd35eb407f4');
INSERT INTO public.tutor VALUES ('e808dde1-80ef-4296-9f32-5be6c0c7956c', 'Sinh viên', 'Sinh viên năm 4', 'b0b38335-56c6-4bb6-aa15-67653b3885f6');
INSERT INTO public.tutor VALUES ('cb8c21d6-e375-4f86-bedf-f97c69b19806', 'Sinh viên', 'Sinh viên năm 4', '3eb8d9e7-ea24-43aa-9fe6-eb573860479b');
INSERT INTO public.tutor VALUES ('c4ca029e-adc5-4b05-a7ad-b7e38645abe7', 'Sinh viên', 'Sinh viên năm 4', '6db1f224-176c-4100-b805-d2b4b6281728');
INSERT INTO public.tutor VALUES ('a01edf3e-bfb8-4167-a074-cc48f687c95e', 'Sinh viên', 'Sinh viên năm 4', '4e50d9de-130e-475f-a90e-5cdc7316b2ce');
INSERT INTO public.tutor VALUES ('b7530a58-5ab1-4bab-aa34-c0296cad98be', 'Sinh viên', 'Sinh viên năm 4', '97c63ccd-80c2-4544-94f9-a497133fcd30');
INSERT INTO public.tutor VALUES ('4a0df775-e201-4b4c-9bce-c82f67596e06', 'Sinh viên', 'Sinh viên năm 4', '8a4f63cd-10d9-440c-b3c4-0900111ceb8f');
INSERT INTO public.tutor VALUES ('4943b11b-b07a-4837-810b-5e68d9ee62cf', 'Sinh viên', 'Sinh viên năm 4', '5a45cfc1-549f-4024-bc06-c9bdb9704b07');


--
-- Data for Name: tutor_subject_map; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tutor_subject_map VALUES ('794ab49d-4cfe-4598-9aec-e49863c24dcd', '314b68d8-a6cb-4221-bbde-2ce15ca2e2cd', '2dfba33f-f110-45f0-9b9e-bc4fd19145bd');
INSERT INTO public.tutor_subject_map VALUES ('14b14491-9c11-4135-8d9c-3188653989d8', '314b68d8-a6cb-4221-bbde-2ce15ca2e2cd', '50899f5e-0ee7-43af-a448-701d3515b03b');
INSERT INTO public.tutor_subject_map VALUES ('7b278f72-32be-43ce-bfb7-fa86f12feea0', '4636d38c-338c-449d-917c-dab18f1996f7', 'ed55892a-5892-47a3-af1e-4defac6c1bd4');
INSERT INTO public.tutor_subject_map VALUES ('94cea124-8009-4d71-b5c6-b5df72bc199c', '4636d38c-338c-449d-917c-dab18f1996f7', 'c10035a4-f18e-4d6a-89ee-1d42ceb24573');
INSERT INTO public.tutor_subject_map VALUES ('74c277c3-8c75-4cf2-959d-40bfed0b48a7', '4636d38c-338c-449d-917c-dab18f1996f7', 'd3c6d61b-5b6f-4c45-a032-78f60f4aebbd');
INSERT INTO public.tutor_subject_map VALUES ('e836bde4-7d71-401f-b267-98a3230f8204', '4636d38c-338c-449d-917c-dab18f1996f7', '2dfba33f-f110-45f0-9b9e-bc4fd19145bd');
INSERT INTO public.tutor_subject_map VALUES ('5cbe8d63-69d8-4c02-b060-95a7d5e23963', '4636d38c-338c-449d-917c-dab18f1996f7', '50899f5e-0ee7-43af-a448-701d3515b03b');
INSERT INTO public.tutor_subject_map VALUES ('b69d9a84-36f6-41d9-b05c-4ea12a360ade', 'cc161149-7900-4d7d-b73c-e3310adcbbc4', 'd3c6d61b-5b6f-4c45-a032-78f60f4aebbd');
INSERT INTO public.tutor_subject_map VALUES ('041b7b22-aab8-4605-b9e5-d16c908d6ba5', 'cc161149-7900-4d7d-b73c-e3310adcbbc4', '2dfba33f-f110-45f0-9b9e-bc4fd19145bd');
INSERT INTO public.tutor_subject_map VALUES ('9ef1cf43-f020-44cb-8cd0-8707c4243ee2', 'cc161149-7900-4d7d-b73c-e3310adcbbc4', '50899f5e-0ee7-43af-a448-701d3515b03b');
INSERT INTO public.tutor_subject_map VALUES ('fd9e75b2-7045-4139-9264-71a4115e4b6b', 'cc161149-7900-4d7d-b73c-e3310adcbbc4', 'c10035a4-f18e-4d6a-89ee-1d42ceb24573');
INSERT INTO public.tutor_subject_map VALUES ('d98e97b1-0028-4f8f-9826-7b572392027b', 'e808dde1-80ef-4296-9f32-5be6c0c7956c', '50899f5e-0ee7-43af-a448-701d3515b03b');
INSERT INTO public.tutor_subject_map VALUES ('9810777d-03b0-4599-b470-199cbec1916a', 'cb8c21d6-e375-4f86-bedf-f97c69b19806', '50899f5e-0ee7-43af-a448-701d3515b03b');
INSERT INTO public.tutor_subject_map VALUES ('4963d3df-80ba-424e-ae5d-a8cf6dc2a793', 'c4ca029e-adc5-4b05-a7ad-b7e38645abe7', 'ed55892a-5892-47a3-af1e-4defac6c1bd4');
INSERT INTO public.tutor_subject_map VALUES ('0e57d5cc-15f4-4f73-bd38-88d29b552162', 'a01edf3e-bfb8-4167-a074-cc48f687c95e', '50899f5e-0ee7-43af-a448-701d3515b03b');
INSERT INTO public.tutor_subject_map VALUES ('41489a65-b4d3-40b7-a72d-3d36d0d1f9a9', 'a01edf3e-bfb8-4167-a074-cc48f687c95e', 'ed55892a-5892-47a3-af1e-4defac6c1bd4');
INSERT INTO public.tutor_subject_map VALUES ('fcb2b622-f779-4c34-9c06-210a6d2c2b18', 'b7530a58-5ab1-4bab-aa34-c0296cad98be', 'd3c6d61b-5b6f-4c45-a032-78f60f4aebbd');
INSERT INTO public.tutor_subject_map VALUES ('72112fbf-9b8b-46de-a3e2-e285daecd4c1', 'b7530a58-5ab1-4bab-aa34-c0296cad98be', '2dfba33f-f110-45f0-9b9e-bc4fd19145bd');
INSERT INTO public.tutor_subject_map VALUES ('633eceb7-db75-44de-8002-6b90a5c2ffcc', '4a0df775-e201-4b4c-9bce-c82f67596e06', '50899f5e-0ee7-43af-a448-701d3515b03b');
INSERT INTO public.tutor_subject_map VALUES ('33c13afc-e794-4840-919a-64d585625147', '4a0df775-e201-4b4c-9bce-c82f67596e06', '2dfba33f-f110-45f0-9b9e-bc4fd19145bd');
INSERT INTO public.tutor_subject_map VALUES ('5b6e31f3-2e21-4b88-9c6d-cfcdba292dfe', '4a0df775-e201-4b4c-9bce-c82f67596e06', 'd3c6d61b-5b6f-4c45-a032-78f60f4aebbd');
INSERT INTO public.tutor_subject_map VALUES ('0e019b67-5369-4740-bff6-01a3a791db86', '4943b11b-b07a-4837-810b-5e68d9ee62cf', '50899f5e-0ee7-43af-a448-701d3515b03b');
INSERT INTO public.tutor_subject_map VALUES ('51cd5031-1f0d-4397-8c1b-aac005b41a25', '4943b11b-b07a-4837-810b-5e68d9ee62cf', '2dfba33f-f110-45f0-9b9e-bc4fd19145bd');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES ('3da5fef8-6e90-45bd-840d-c4a9678140ae', 'admin', 'admin@gmail.com', '0398454152', 22, 'admin0123', '$2a$10$J3lOrNI0U.2MNcosAhZF4eoxvfA8fqNO5L.VpExwNivQ8RtKU0hnm', 0, 1);
INSERT INTO public.users VALUES ('af88cb3a-1e26-40f4-abd7-800cbddd7be2', 'Dương Trung abc', 'wontthe1009@gmail.com', '0398454157', 20, 'trungquoc2', '$2a$10$7Y8QxjWn.gLRnoPFpN5im.cuYSQ1D6muIHNhazYaNl1RY8CS/B5gS', 1, 1);
INSERT INTO public.users VALUES ('e10e6281-91ed-499e-b83a-58dd66865d26', 'Test', 'duongtrungquoc2002@gmail.com', '0398454153', 12, 'test1234', '$2a$10$WTHLIZu12jj8.mLv4IAk.uuvHRpDZcZHeUV6ruES7t/NU5Dpw5K/q', 1, 1);
INSERT INTO public.users VALUES ('736f42e1-ad37-446e-bc07-6bd35eb407f4', 'Test a', 'test2@gmail.com', '0398454102', 20, 'test0002', '$2a$10$GZuIiEe2WdD2WRcl.L/8AuUrHDsoDA757W0TgIdrRe/ypTrk8.5hu', 1, 1);
INSERT INTO public.users VALUES ('b0b38335-56c6-4bb6-aa15-67653b3885f6', 'Test b', 'test3@gmail.com', '0398454103', 20, 'test0003', '$2a$10$/LqC5X4jdMLXiu4tGN4aEOVZJZjztpAy5q1IUDQwuaqB7H7EoqkEG', 1, 1);
INSERT INTO public.users VALUES ('3eb8d9e7-ea24-43aa-9fe6-eb573860479b', 'Test c', 'test4@gmail.com', '0398454104', 20, 'test0004', '$2a$10$LhBhkw8YTx5z.gyYVRsWpev7BirWfxJmy18LqSnOKG1TqL8eBs1Ca', 1, 1);
INSERT INTO public.users VALUES ('6db1f224-176c-4100-b805-d2b4b6281728', 'Test d', 'test5@gmail.com', '0398454105', 20, 'test0005', '$2a$10$AVVKJKYv7Ce3ocsM4at2cu49ppnRXLG4Ypz9Agq75UfZVKN8JGUhq', 1, 1);
INSERT INTO public.users VALUES ('4e50d9de-130e-475f-a90e-5cdc7316b2ce', 'test e', 'test6@gmail.com', '0398454106', 23, 'test0006', '$2a$10$svtSNGE5vhLr6fGLVG8Oz.Rd4YWEao4tGV/qRyi3Ux7D1rxhROeW6', 1, 1);
INSERT INTO public.users VALUES ('97c63ccd-80c2-4544-94f9-a497133fcd30', 'test r', 'test7@gmail.com', '0398454107', 26, 'test0007', '$2a$10$tIxpPgxPbDzdpsMbfxwwVumHZKkGVnG3Hp3l4t1RR.pv8uzSxIsFG', 1, 1);
INSERT INTO public.users VALUES ('8a4f63cd-10d9-440c-b3c4-0900111ceb8f', 'Dương Trung Quốc', 'duongtrungquoc2001@gmail.com', '0398454110', 22, 'trungquoc109', '$2a$10$gcrONU/DGr4DNfHhdllYz.w/8RuX6da20mP2z2ON1RxO/qXgC0PRW', 1, 1);
INSERT INTO public.users VALUES ('5a45cfc1-549f-4024-bc06-c9bdb9704b07', 'Dương Trung Quốc a', 'test9@gmail.com', '0398454109', 24, 'test0009', '$2a$10$.IB5LD60iL9uprXmBowIouEpPbIHXmoJxCZSQdOAkCFs9RvlB26VO', 1, 1);
INSERT INTO public.users VALUES ('1bc9c112-d58c-4766-b879-80b2689d58d8', 'Dương Trung Quốc', 'tesths@gmail.com', '0398454100', 14, 'hocsinh123', '$2a$10$OhCV6NplXZ/3RUG3ON/T5Oy.FJ3aI/qN5h93CxeujI.L7aIx19iBe', 2, 1);
INSERT INTO public.users VALUES ('ec0c06d5-295c-44fe-bc86-2b79d4e67c42', 'Dương Trung Quốc', 'duongtrungquochs@gmail.com', '0398454000', 17, 'hocsinh1234', '$2a$10$.UwB58XyLuy1x6ZxAzdf9uFl8/3pmBEx/Y8VZdLMcjWbWBKZTmMvK', 2, 1);


--
-- Name: document document_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document
    ADD CONSTRAINT document_pk PRIMARY KEY (id);


--
-- Name: lession lession_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lession
    ADD CONSTRAINT lession_pk PRIMARY KEY (id);


--
-- Name: otp otp_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otp
    ADD CONSTRAINT otp_pk PRIMARY KEY (id);


--
-- Name: salary salary_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary
    ADD CONSTRAINT salary_pk PRIMARY KEY (id);


--
-- Name: student student_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_pk PRIMARY KEY (id);


--
-- Name: student_teaching_subject_map student_teaching_subject_map_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_teaching_subject_map
    ADD CONSTRAINT student_teaching_subject_map_pk PRIMARY KEY (id);


--
-- Name: subject subject_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subject
    ADD CONSTRAINT subject_pk PRIMARY KEY (id);


--
-- Name: teaching_subject teaching_subject_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teaching_subject
    ADD CONSTRAINT teaching_subject_pk PRIMARY KEY (id);


--
-- Name: tutor tutor_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tutor
    ADD CONSTRAINT tutor_pk PRIMARY KEY (id);


--
-- Name: tutor_subject_map tutor_subject_map_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tutor_subject_map
    ADD CONSTRAINT tutor_subject_map_pk PRIMARY KEY (id);


--
-- Name: users users_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pk PRIMARY KEY (id);


--
-- Name: document_lesson_id_instructor_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX document_lesson_id_instructor_id_uindex ON public.document USING btree (lesson_id, instructor_id);


--
-- Name: salary_tutor_id_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX salary_tutor_id_uindex ON public.salary USING btree (tutor_id);


--
-- Name: users_username_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_username_uindex ON public.users USING btree (username);


--
-- Name: document document_tutor_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document
    ADD CONSTRAINT document_tutor_id_fk FOREIGN KEY (instructor_id) REFERENCES public.tutor(id);


--
-- Name: lession lession_class_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lession
    ADD CONSTRAINT lession_class_id_fk FOREIGN KEY (teaching_subject_id) REFERENCES public.teaching_subject(id);


--
-- Name: salary salary_tutor_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary
    ADD CONSTRAINT salary_tutor_id_fk FOREIGN KEY (tutor_id) REFERENCES public.tutor(id);


--
-- Name: student_teaching_subject_map student_class_map_class_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_teaching_subject_map
    ADD CONSTRAINT student_class_map_class_id_fk FOREIGN KEY (teaching_subject_id) REFERENCES public.teaching_subject(id);


--
-- Name: student_teaching_subject_map student_teaching_subject_map_student_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_teaching_subject_map
    ADD CONSTRAINT student_teaching_subject_map_student_id_fk FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- Name: student student_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: teaching_subject teaching_subject_subject_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teaching_subject
    ADD CONSTRAINT teaching_subject_subject_id_fk FOREIGN KEY (subject_id) REFERENCES public.subject(id);


--
-- Name: teaching_subject teaching_subject_tutor_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teaching_subject
    ADD CONSTRAINT teaching_subject_tutor_id_fk FOREIGN KEY (instructor_id) REFERENCES public.tutor(id);


--
-- Name: tutor_subject_map tutor_subject_map_subject_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tutor_subject_map
    ADD CONSTRAINT tutor_subject_map_subject_id_fk FOREIGN KEY (subject_id) REFERENCES public.subject(id);


--
-- Name: tutor_subject_map tutor_subject_map_tutor_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tutor_subject_map
    ADD CONSTRAINT tutor_subject_map_tutor_id_fk FOREIGN KEY (tutor_id) REFERENCES public.tutor(id);


--
-- Name: tutor tutor_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tutor
    ADD CONSTRAINT tutor_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

