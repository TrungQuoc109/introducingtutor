--
-- trungquocQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.3

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

DROP DATABASE IF EXISTS introducingtutor_37cl;
--
-- Name: introducingtutor_37cl; Type: DATABASE; Schema: -; Owner: trungquoc
--

CREATE DATABASE introducingtutor_37cl WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE introducingtutor_37cl OWNER TO trungquoc;

\c introducingtutor_37cl

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

--
-- Name: introducingtutor_37cl; Type: DATABASE PROPERTIES; Schema: -; Owner: trungquoc
--

ALTER DATABASE introducingtutor_37cl SET "TimeZone" TO 'Asia/Ho_Chi_Minh';


\c introducingtutor_37cl

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: trungquoc
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO trungquoc;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: trungquoc
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: document; Type: TABLE; Schema: public; Owner: trungquoc
--

CREATE TABLE public.document (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    instructor_id uuid NOT NULL,
    url text NOT NULL,
    lesson_id uuid DEFAULT public.uuid_generate_v4() NOT NULL
);
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


ALTER TABLE public.document OWNER TO trungquoc;

--
-- Name: lesson; Type: TABLE; Schema: public; Owner: trungquoc
--

CREATE TABLE public.lesson (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    start_time time without time zone NOT NULL,
    duration integer NOT NULL,
    teaching_subject_id uuid NOT NULL,
    day_of_week integer NOT NULL
);


ALTER TABLE public.lesson OWNER TO trungquoc;

--
-- Name: location; Type: TABLE; Schema: public; Owner: trungquoc
--

CREATE TABLE public.location (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    tutor_id uuid NOT NULL,
    districts_id integer NOT NULL
);


ALTER TABLE public.location OWNER TO trungquoc;

--
-- Name: otp; Type: TABLE; Schema: public; Owner: trungquoc
--

CREATE TABLE public.otp (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    code character(6) NOT NULL,
    email character varying(100) NOT NULL,
    create_at timestamp without time zone DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Ho_Chi_Minh'::text) NOT NULL
);


ALTER TABLE public.otp OWNER TO trungquoc;

--
-- Name: salary; Type: TABLE; Schema: public; Owner: trungquoc
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


ALTER TABLE public.salary OWNER TO trungquoc;

--
-- Name: student; Type: TABLE; Schema: public; Owner: trungquoc
--

CREATE TABLE public.student (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    grade_level integer NOT NULL,
    user_id uuid NOT NULL
);


ALTER TABLE public.student OWNER TO trungquoc;

--
-- Name: student_teaching_subject_map; Type: TABLE; Schema: public; Owner: trungquoc
--

CREATE TABLE public.student_teaching_subject_map (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    student_id uuid NOT NULL,
    teaching_subject_id uuid NOT NULL,
    order_id character varying NOT NULL,
    amount numeric(10,2) NOT NULL,
    trans_id character varying,
    status integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.student_teaching_subject_map OWNER TO trungquoc;

--
-- Name: subject; Type: TABLE; Schema: public; Owner: trungquoc
--

CREATE TABLE public.subject (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.subject OWNER TO trungquoc;

--
-- Name: teaching_subject; Type: TABLE; Schema: public; Owner: trungquoc
--

CREATE TABLE public.teaching_subject (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    instructor_id uuid NOT NULL,
    subject_id uuid NOT NULL,
    description text,
    start_date date DEFAULT CURRENT_DATE NOT NULL,
    number_of_sessions integer NOT NULL,
    location_id integer NOT NULL,
    price integer NOT NULL,
    student_count integer NOT NULL,
    status integer DEFAULT 1 NOT NULL,
    grade_level integer NOT NULL,
    specific_address character varying NOT NULL
);


ALTER TABLE public.teaching_subject OWNER TO trungquoc;

--
-- Name: tutor; Type: TABLE; Schema: public; Owner: trungquoc
--

CREATE TABLE public.tutor (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    education character varying(50) NOT NULL,
    experience text NOT NULL,
    user_id uuid NOT NULL
);


ALTER TABLE public.tutor OWNER TO trungquoc;

--
-- Name: tutor_subject_map; Type: TABLE; Schema: public; Owner: trungquoc
--

CREATE TABLE public.tutor_subject_map (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tutor_id uuid NOT NULL,
    subject_id uuid NOT NULL
);


ALTER TABLE public.tutor_subject_map OWNER TO trungquoc;

--
-- Name: users; Type: TABLE; Schema: public; Owner: trungquoc
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


ALTER TABLE public.users OWNER TO trungquoc;

--
-- Data for Name: document; Type: TABLE DATA; Schema: public; Owner: trungquoc
--



--
-- Data for Name: lesson; Type: TABLE DATA; Schema: public; Owner: trungquoc
--

INSERT INTO public.lesson VALUES ('7b05f30e-13b4-4640-b1b1-ed3b2b39880f', '07:30:00', 120, '6963ae7a-7009-4fe3-a522-17f845320c06', 2);
INSERT INTO public.lesson VALUES ('a196ddf9-aec1-49a0-b13b-8182dc987e40', '09:30:00', 120, '6963ae7a-7009-4fe3-a522-17f845320c06', 4);
INSERT INTO public.lesson VALUES ('6ba99652-bc1e-480f-86ca-be0f222bf513', '13:30:00', 120, '6963ae7a-7009-4fe3-a522-17f845320c06', 6);
INSERT INTO public.lesson VALUES ('b69dad1e-5a69-49d5-b3ac-2c9d1f4db925', '09:45:00', 90, '441a8ef1-aebe-4698-91e8-43943c77ce92', 2);
INSERT INTO public.lesson VALUES ('675377b5-c6d9-4713-9328-cb94e11b1446', '07:45:00', 90, '441a8ef1-aebe-4698-91e8-43943c77ce92', 4);
INSERT INTO public.lesson VALUES ('1c64b896-bde3-4681-b571-83bea962d1ce', '07:30:00', 120, 'e7e8c4c3-715f-4dd2-8f7e-dbdc9281a35e', 3);


--
-- Data for Name: location; Type: TABLE DATA; Schema: public; Owner: trungquoc
--

INSERT INTO public.location VALUES ('8e54a027-e6ae-4e1d-b864-c7e8ba9ebc26', 'Quận Tân Bình', '2e82e344-5f98-4228-81bb-89b7740984b1', 766);
INSERT INTO public.location VALUES ('1284ddfc-9ab2-419c-a09e-70deb0b98d28', 'Quận Tân Phú', '2e82e344-5f98-4228-81bb-89b7740984b1', 767);
INSERT INTO public.location VALUES ('ccf265fb-c2ac-4fb6-abd6-5cc01a09fa3a', 'Huyện Hóc Môn', 'be0558fa-1d38-497f-9b82-6daf0505e924', 784);
INSERT INTO public.location VALUES ('c4ef5846-086a-4cfa-88e6-e01b53808a3a', 'Quận Tân Phú', 'be0558fa-1d38-497f-9b82-6daf0505e924', 767);
INSERT INTO public.location VALUES ('f84c14cd-1c18-4660-a705-f7bc010994ec', 'Quận 8', 'caa269c1-eb92-421d-aeac-f28941b394d0', 776);
INSERT INTO public.location VALUES ('0a95bc6c-a51b-4025-8161-0d7e1d59a5a9', 'Quận 5', 'caa269c1-eb92-421d-aeac-f28941b394d0', 774);
INSERT INTO public.location VALUES ('e8c14905-eb8c-4889-8513-32097c001ef1', 'Quận 7', '960b6904-fb8e-4331-9f4d-7b9710a9e497', 778);
INSERT INTO public.location VALUES ('fbd797f1-6650-4259-8c0f-d1bb020bcc1d', 'Quận 8', '960b6904-fb8e-4331-9f4d-7b9710a9e497', 776);
INSERT INTO public.location VALUES ('b0436bc7-ce63-4338-9193-c2ee39ee8aab', 'Quận 8', '128cf786-6c1a-47a1-bc5e-1bac5f94f6cc', 776);
INSERT INTO public.location VALUES ('cb814cc4-52eb-4554-90bf-cce29b170646', 'Quận 5', '128cf786-6c1a-47a1-bc5e-1bac5f94f6cc', 774);


--
-- Data for Name: otp; Type: TABLE DATA; Schema: public; Owner: trungquoc
--

INSERT INTO public.otp VALUES ('b4afac0c-89df-4d25-a34c-1f8d8b5d5699', '062425', 'nhauyen@gmail.com', '2024-06-22 21:19:27.384613');
INSERT INTO public.otp VALUES ('4239eba5-8e1e-4a37-939f-9db1a4c5ae69', '764426', 'ductien@gmail.com', '2024-06-22 21:37:09.726379');
INSERT INTO public.otp VALUES ('2b119deb-8da5-44aa-9ff5-30e53bddbcfd', '327383', 'duchai@gmail.com', '2024-06-22 21:39:06.486853');
INSERT INTO public.otp VALUES ('57f87489-f3ac-42e3-b606-b785b741eccb', '405996', 'baotam@gmail.com', '2024-06-22 21:45:11.84297');


--
-- Data for Name: salary; Type: TABLE DATA; Schema: public; Owner: trungquoc
--



--
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: trungquoc
--

INSERT INTO public.student VALUES ('ef1c3757-5ad6-4bf8-b861-611fcc59ea0d', 12, '5e072379-c77b-465a-a7fa-a2549da1259e');
INSERT INTO public.student VALUES ('4e620549-5a80-4c20-93b6-4e5bbc4dc770', 12, 'de4d44b6-24ef-4252-b2eb-4d66a46871f9');


--
-- Data for Name: student_teaching_subject_map; Type: TABLE DATA; Schema: public; Owner: trungquoc
--



--
-- Data for Name: subject; Type: TABLE DATA; Schema: public; Owner: trungquoc
--

INSERT INTO public.subject VALUES ('50899f5e-0ee7-43af-a448-701d3515b03b', 'Toán');
INSERT INTO public.subject VALUES ('2dfba33f-f110-45f0-9b9e-bc4fd19145bd', 'Vật lý');
INSERT INTO public.subject VALUES ('d3c6d61b-5b6f-4c45-a032-78f60f4aebbd', 'Hóa học');
INSERT INTO public.subject VALUES ('c10035a4-f18e-4d6a-89ee-1d42ceb24573', 'Tiếng Anh');
INSERT INTO public.subject VALUES ('ed55892a-5892-47a3-af1e-4defac6c1bd4', 'Sinh học');


--
-- Data for Name: teaching_subject; Type: TABLE DATA; Schema: public; Owner: trungquoc
--

INSERT INTO public.teaching_subject VALUES ('441a8ef1-aebe-4698-91e8-43943c77ce92', 'Dao động', 'caa269c1-eb92-421d-aeac-f28941b394d0', '2dfba33f-f110-45f0-9b9e-bc4fd19145bd', 'Chuyển động điều hoà', '2024-07-06', 6, 776, 200000, 2, 2, 12, '180 Cao Lỗ');
INSERT INTO public.teaching_subject VALUES ('6963ae7a-7009-4fe3-a522-17f845320c06', 'Hàm số ', 'caa269c1-eb92-421d-aeac-f28941b394d0', '50899f5e-0ee7-43af-a448-701d3515b03b', 'Khảo sát hàm số, tìm khoảng đồng biến, nghịch biến của hàm số', '2024-07-04', 5, 776, 200000, 2, 1, 12, '180 Cao Lỗ');
INSERT INTO public.teaching_subject VALUES ('e7e8c4c3-715f-4dd2-8f7e-dbdc9281a35e', 'Hình học', 'caa269c1-eb92-421d-aeac-f28941b394d0', '50899f5e-0ee7-43af-a448-701d3515b03b', 'Hình học không gian', '2024-07-04', 6, 776, 200000, 2, 2, 12, '180 Cao Lỗ');


--
-- Data for Name: tutor; Type: TABLE DATA; Schema: public; Owner: trungquoc
--

INSERT INTO public.tutor VALUES ('2e82e344-5f98-4228-81bb-89b7740984b1', 'Sinh viên', 'Sinh viên năm 4', '28aaab3c-e228-411b-b1c2-b43867198376');
INSERT INTO public.tutor VALUES ('be0558fa-1d38-497f-9b82-6daf0505e924', 'Sinh viên', 'Sinh viên năm 4', '68df0871-781a-4a11-831c-a7797f547815');
INSERT INTO public.tutor VALUES ('caa269c1-eb92-421d-aeac-f28941b394d0', 'Giáo viên', 'Mới tốt nghiệp', 'c741e779-6a01-4179-9780-bb9193bb0e9d');
INSERT INTO public.tutor VALUES ('960b6904-fb8e-4331-9f4d-7b9710a9e497', 'Sinh viên', 'Sinh viên năm 4', '525645fd-ec62-4376-8325-9173471c8f62');
INSERT INTO public.tutor VALUES ('128cf786-6c1a-47a1-bc5e-1bac5f94f6cc', 'Giáo viên', 'Giảng dạy 2 năm', '53237248-41fd-4fc5-8215-f582dc127c33');


--
-- Data for Name: tutor_subject_map; Type: TABLE DATA; Schema: public; Owner: trungquoc
--

INSERT INTO public.tutor_subject_map VALUES ('e63729d2-ee67-42a1-afcc-4f84ef126eb3', '2e82e344-5f98-4228-81bb-89b7740984b1', 'ed55892a-5892-47a3-af1e-4defac6c1bd4');
INSERT INTO public.tutor_subject_map VALUES ('a12297b5-0334-4dcc-a8cf-50b564a964a9', '2e82e344-5f98-4228-81bb-89b7740984b1', 'd3c6d61b-5b6f-4c45-a032-78f60f4aebbd');
INSERT INTO public.tutor_subject_map VALUES ('eb5768d9-c41b-4359-8313-c03cae888437', '2e82e344-5f98-4228-81bb-89b7740984b1', '50899f5e-0ee7-43af-a448-701d3515b03b');
INSERT INTO public.tutor_subject_map VALUES ('68e549c3-d774-4380-816b-64bf7c79f962', 'be0558fa-1d38-497f-9b82-6daf0505e924', 'ed55892a-5892-47a3-af1e-4defac6c1bd4');
INSERT INTO public.tutor_subject_map VALUES ('ea27467e-6a89-4604-8181-63b62fff6059', 'be0558fa-1d38-497f-9b82-6daf0505e924', 'd3c6d61b-5b6f-4c45-a032-78f60f4aebbd');
INSERT INTO public.tutor_subject_map VALUES ('e9e096fd-38e3-4989-a20b-ec3d012911cf', 'caa269c1-eb92-421d-aeac-f28941b394d0', '2dfba33f-f110-45f0-9b9e-bc4fd19145bd');
INSERT INTO public.tutor_subject_map VALUES ('edd43d25-ada4-4471-8679-28f78e53eee7', 'caa269c1-eb92-421d-aeac-f28941b394d0', '50899f5e-0ee7-43af-a448-701d3515b03b');
INSERT INTO public.tutor_subject_map VALUES ('963c2b9f-d8ec-4986-9186-524cf1c03da5', '960b6904-fb8e-4331-9f4d-7b9710a9e497', '2dfba33f-f110-45f0-9b9e-bc4fd19145bd');
INSERT INTO public.tutor_subject_map VALUES ('533fb3d1-828b-4570-a2dd-5ca91e7083b9', '960b6904-fb8e-4331-9f4d-7b9710a9e497', '50899f5e-0ee7-43af-a448-701d3515b03b');
INSERT INTO public.tutor_subject_map VALUES ('bc7ec85d-b3de-4b23-852b-973e4de5cea5', '128cf786-6c1a-47a1-bc5e-1bac5f94f6cc', 'd3c6d61b-5b6f-4c45-a032-78f60f4aebbd');
INSERT INTO public.tutor_subject_map VALUES ('0ea4612f-172e-4e1d-afdc-23f514b600f7', '128cf786-6c1a-47a1-bc5e-1bac5f94f6cc', '50899f5e-0ee7-43af-a448-701d3515b03b');
INSERT INTO public.tutor_subject_map VALUES ('3bb09f3f-f5b2-4e6d-bf71-71387706d8d0', '128cf786-6c1a-47a1-bc5e-1bac5f94f6cc', 'c10035a4-f18e-4d6a-89ee-1d42ceb24573');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: trungquoc
--

INSERT INTO public.users VALUES ('3da5fef8-6e90-45bd-840d-c4a9678140ae', 'admin', 'admin@gmail.com', '0398454152', 22, 'admin0123', '$2a$10$J3lOrNI0U.2MNcosAhZF4eoxvfA8fqNO5L.VpExwNivQ8RtKU0hnm', 0, 1);
INSERT INTO public.users VALUES ('5e072379-c77b-465a-a7fa-a2549da1259e', 'Nguyễn Thái Kiệt', 'thaikiet@gmail.com', '0353427990', 22, 'thaikiet123', '$2a$10$aSVxGESgdRIKTkv2Nh4gj.bERx1lIGTHtTyxTPXLyBv2GSkygOcHW', 2, 1);
INSERT INTO public.users VALUES ('28aaab3c-e228-411b-b1c2-b43867198376', 'Chiêu Nhả Uyên', 'nhauyen@gmail.com', '0366811651', 22, 'nhauyen123', '$2a$10$uEaMOZSwLXmwZvUB6SZunO.Bl9nSBVLp05QHvT8Fdh3twZLaKKjeG', 1, 1);
INSERT INTO public.users VALUES ('68df0871-781a-4a11-831c-a7797f547815', 'Nguyễn Thị Trúc Linh', 'truclinh@gmail.com', '0782478353', 22, 'truclinh123', '$2a$10$ZmQjsVULxtBWSpzayzPrDuM6/3W7nifAdEOZ3bYOf6Tbxivwa9c26', 1, 1);
INSERT INTO public.users VALUES ('c741e779-6a01-4179-9780-bb9193bb0e9d', 'Trần Thị Huỳnh Yến', 'huynhyen@gmail.com', '0375066881', 22, 'huynhyen123', '$2a$10$Avz3bI0RcE6zB8MeOtSApOnIgzASAHNxikUaOofXr2To12vlzR29O', 1, 1);
INSERT INTO public.users VALUES ('525645fd-ec62-4376-8325-9173471c8f62', 'Phan Đức Tiến', 'ductien@gmail.com', '0866629019', 22, 'ductien123', '$2a$10$Yjpm36cUpK7.hgok6AJkKeKYAdW6FdH3UzHB8/Om/bY3k2dAr/mjG', 1, 1);
INSERT INTO public.users VALUES ('de4d44b6-24ef-4252-b2eb-4d66a46871f9', 'Trần Đức Hải', 'duchai@gmail.com', '0869289766', 22, 'duchai123', '$2a$10$cjM5MOgg8wTWcyZJYxMdPelrx8KYnQ6z7vpmyF8mRbb457oV0/xYe', 2, 1);
INSERT INTO public.users VALUES ('53237248-41fd-4fc5-8215-f582dc127c33', 'Văn Bảo Tâm', 'baotam@gmail.com', '0338005958', 22, 'baotam123', '$2a$10$A0GX/dY06dPqNqqwtLeTL.K0GWDT6MZcyVHDRyU1LnD2CU62v6WFC', 1, 1);


--
-- Name: document document_pk; Type: CONSTRAINT; Schema: public; Owner: trungquoc
--

ALTER TABLE ONLY public.document
    ADD CONSTRAINT document_pk PRIMARY KEY (id);


--
-- Name: lesson lession_pk; Type: CONSTRAINT; Schema: public; Owner: trungquoc
--

ALTER TABLE ONLY public.lesson
    ADD CONSTRAINT lession_pk PRIMARY KEY (id);


--
-- Name: location location_pk; Type: CONSTRAINT; Schema: public; Owner: trungquoc
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_pk PRIMARY KEY (id);


--
-- Name: otp otp_pk; Type: CONSTRAINT; Schema: public; Owner: trungquoc
--

ALTER TABLE ONLY public.otp
    ADD CONSTRAINT otp_pk PRIMARY KEY (id);


--
-- Name: salary salary_pk; Type: CONSTRAINT; Schema: public; Owner: trungquoc
--

ALTER TABLE ONLY public.salary
    ADD CONSTRAINT salary_pk PRIMARY KEY (id);


--
-- Name: student student_pk; Type: CONSTRAINT; Schema: public; Owner: trungquoc
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_pk PRIMARY KEY (id);


--
-- Name: student_teaching_subject_map student_teaching_subject_map_pk; Type: CONSTRAINT; Schema: public; Owner: trungquoc
--

ALTER TABLE ONLY public.student_teaching_subject_map
    ADD CONSTRAINT student_teaching_subject_map_pk PRIMARY KEY (id);


--
-- Name: subject subject_pk; Type: CONSTRAINT; Schema: public; Owner: trungquoc
--

ALTER TABLE ONLY public.subject
    ADD CONSTRAINT subject_pk PRIMARY KEY (id);


--
-- Name: teaching_subject teaching_subject_pk; Type: CONSTRAINT; Schema: public; Owner: trungquoc
--

ALTER TABLE ONLY public.teaching_subject
    ADD CONSTRAINT teaching_subject_pk PRIMARY KEY (id);


--
-- Name: tutor tutor_pk; Type: CONSTRAINT; Schema: public; Owner: trungquoc
--

ALTER TABLE ONLY public.tutor
    ADD CONSTRAINT tutor_pk PRIMARY KEY (id);


--
-- Name: tutor_subject_map tutor_subject_map_pk; Type: CONSTRAINT; Schema: public; Owner: trungquoc
--

ALTER TABLE ONLY public.tutor_subject_map
    ADD CONSTRAINT tutor_subject_map_pk PRIMARY KEY (id);


--
-- Name: users users_pk; Type: CONSTRAINT; Schema: public; Owner: trungquoc
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pk PRIMARY KEY (id);


--
-- Name: document_lesson_id_instructor_id_uindex; Type: INDEX; Schema: public; Owner: trungquoc
--

CREATE UNIQUE INDEX document_lesson_id_instructor_id_uindex ON public.document USING btree (lesson_id, instructor_id);


--
-- Name: salary_tutor_id_uindex; Type: INDEX; Schema: public; Owner: trungquoc
--

CREATE UNIQUE INDEX salary_tutor_id_uindex ON public.salary USING btree (tutor_id);


--
-- Name: users_username_uindex; Type: INDEX; Schema: public; Owner: trungquoc
--

CREATE UNIQUE INDEX users_username_uindex ON public.users USING btree (username);


--
-- Name: document document_tutor_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: trungquoc
--

ALTER TABLE ONLY public.document
    ADD CONSTRAINT document_tutor_id_fk FOREIGN KEY (instructor_id) REFERENCES public.tutor(id);


--
-- Name: lesson lession_class_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: trungquoc
--

ALTER TABLE ONLY public.lesson
    ADD CONSTRAINT lession_class_id_fk FOREIGN KEY (teaching_subject_id) REFERENCES public.teaching_subject(id);


--
-- Name: location location_tutor_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: trungquoc
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_tutor_id_fk FOREIGN KEY (tutor_id) REFERENCES public.tutor(id);


--
-- Name: salary salary_tutor_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: trungquoc
--

ALTER TABLE ONLY public.salary
    ADD CONSTRAINT salary_tutor_id_fk FOREIGN KEY (tutor_id) REFERENCES public.tutor(id);


--
-- Name: student_teaching_subject_map student_class_map_class_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: trungquoc
--

ALTER TABLE ONLY public.student_teaching_subject_map
    ADD CONSTRAINT student_class_map_class_id_fk FOREIGN KEY (teaching_subject_id) REFERENCES public.teaching_subject(id);


--
-- Name: student_teaching_subject_map student_teaching_subject_map_student_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: trungquoc
--

ALTER TABLE ONLY public.student_teaching_subject_map
    ADD CONSTRAINT student_teaching_subject_map_student_id_fk FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- Name: student student_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: trungquoc
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: teaching_subject teaching_subject_subject_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: trungquoc
--

ALTER TABLE ONLY public.teaching_subject
    ADD CONSTRAINT teaching_subject_subject_id_fk FOREIGN KEY (subject_id) REFERENCES public.subject(id);


--
-- Name: teaching_subject teaching_subject_tutor_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: trungquoc
--

ALTER TABLE ONLY public.teaching_subject
    ADD CONSTRAINT teaching_subject_tutor_id_fk FOREIGN KEY (instructor_id) REFERENCES public.tutor(id);


--
-- Name: tutor_subject_map tutor_subject_map_subject_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: trungquoc
--

ALTER TABLE ONLY public.tutor_subject_map
    ADD CONSTRAINT tutor_subject_map_subject_id_fk FOREIGN KEY (subject_id) REFERENCES public.subject(id);


--
-- Name: tutor_subject_map tutor_subject_map_tutor_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: trungquoc
--

ALTER TABLE ONLY public.tutor_subject_map
    ADD CONSTRAINT tutor_subject_map_tutor_id_fk FOREIGN KEY (tutor_id) REFERENCES public.tutor(id);


--
-- Name: tutor tutor_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: trungquoc
--

ALTER TABLE ONLY public.tutor
    ADD CONSTRAINT tutor_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- trungquocQL database dump complete
--

