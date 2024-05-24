--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2 (Ubuntu 16.2-1.pgdg22.04+1)

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
    title character varying(100) NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    duration integer NOT NULL,
    topic character varying(100) NOT NULL,
    teaching_subject_id uuid NOT NULL
);


ALTER TABLE public.lession OWNER TO postgres;

--
-- Name: otp; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.otp (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    code character(6) NOT NULL,
    email character varying(100) NOT NULL,
    create_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
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
    end_date date NOT NULL,
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

INSERT INTO public.student VALUES ('91183520-4b2d-42e9-9b5a-6604cc784d59', 12, '3a9e03b4-a112-4868-b387-669094a5f9a9');
INSERT INTO public.student VALUES ('d12b6d57-eb0c-4f3b-9e22-7a2f341bd243', 12, '689436e3-377e-4119-9f6d-ca90410172ab');


--
-- Data for Name: student_teaching_subject_map; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.student_teaching_subject_map VALUES ('fd65d596-132b-4923-9f93-ace652622f18', '91183520-4b2d-42e9-9b5a-6604cc784d59', '608db088-ea72-40b5-be3c-64dda016233d');


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

INSERT INTO public.teaching_subject VALUES ('608db088-ea72-40b5-be3c-64dda016233d', 'Toán 11', '9bdf18b6-71e0-4c43-acad-18003183b084', '50899f5e-0ee7-43af-a448-701d3515b03b', 'Nội dung toán 11', '2024-05-15', '2024-05-22', 7, 'Quận 8', 5000000, 20, 1, 11);


--
-- Data for Name: tutor; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tutor VALUES ('9bdf18b6-71e0-4c43-acad-18003183b084', 'Sinh viên', '2 năm', '8eda7cfd-81f2-419f-a4a7-f527774d31aa');


--
-- Data for Name: tutor_subject_map; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tutor_subject_map VALUES ('5d91e356-b91c-4a44-8f25-249e68d433da', '9bdf18b6-71e0-4c43-acad-18003183b084', '50899f5e-0ee7-43af-a448-701d3515b03b');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES ('3da5fef8-6e90-45bd-840d-c4a9678140ae', 'admin', 'admin@gmail.com', '0398454152', 22, 'admin0123', '$2a$10$J3lOrNI0U.2MNcosAhZF4eoxvfA8fqNO5L.VpExwNivQ8RtKU0hnm', 0, 1);
INSERT INTO public.users VALUES ('8eda7cfd-81f2-419f-a4a7-f527774d31aa', 'Văn Bảo Tâm', 'postgres2002@gmail.com', '+84398454152', 22, 'baotam22', '$2a$10$bZxRC.MM8fFbzO9eGL1CMem3MdqB2fpfTk4j1SFxxud.UHhk6HTuG', 1, 1);
INSERT INTO public.users VALUES ('3a9e03b4-a112-4868-b387-669094a5f9a9', 'Dương Trung Quốc', 'dh52006058@student.stu.edu.vn', '0398454152', 22, 'trungquoc22', '$2a$10$LUSQxF1YwJW69AFamyYxfevnZVCXKeWBH.JZ3J6lpgcoT8HBbJraS', 2, 1);
INSERT INTO public.users VALUES ('689436e3-377e-4119-9f6d-ca90410172ab', 'Phan Đức Tiến', 'test@student.edu.vn', '0398454152', 22, 'tien22', '$2a$10$ppYl5aerCq3spLD8aFhtqeoyEj11eA2ZWjQne93hNf7qU3.47A1Bu', 2, 1);


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

