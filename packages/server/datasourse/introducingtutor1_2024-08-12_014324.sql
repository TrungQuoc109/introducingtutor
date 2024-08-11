--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Debian 16.3-1.pgdg120+1)
-- Dumped by pg_dump version 16.1

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
    status integer DEFAULT 1 NOT NULL,
    order_date date
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
    status integer DEFAULT 1 NOT NULL,
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
    status integer DEFAULT 1 NOT NULL,
    gender integer
);


ALTER TABLE public.users OWNER TO trungquoc;

--
-- Data for Name: lesson; Type: TABLE DATA; Schema: public; Owner: trungquoc
--

COPY public.lesson (id, start_time, duration, teaching_subject_id, day_of_week) FROM stdin;
9938b22c-6581-48b9-ba86-0a0ad7d05835	07:00:00	90	a290c5c7-354e-46e6-a584-099cc0cecf31	2
ecba9543-bfa9-4907-90c2-c4627796a87a	07:00:00	90	a290c5c7-354e-46e6-a584-099cc0cecf31	4
a889d980-ad76-458c-8ab3-39496a53430f	07:00:00	90	a290c5c7-354e-46e6-a584-099cc0cecf31	6
520826a0-f8dc-4cf3-a5c6-00e643724594	09:15:00	90	8b3d061d-cfba-4b9b-9288-4bc7b0b11163	2
b9115694-fcf8-4d01-9a2b-9692235aa169	09:15:00	90	8b3d061d-cfba-4b9b-9288-4bc7b0b11163	5
ee2d7561-2c0a-49eb-a486-fc1c64a21f67	07:15:00	120	2fdb84cc-ac1b-48e0-b623-e5c783220913	2
2f1988e3-c468-4066-b54c-9e950670c2e6	07:15:00	120	2fdb84cc-ac1b-48e0-b623-e5c783220913	7
ed320651-33f0-42db-a41d-6c7904f5e116	07:15:00	120	2fdb84cc-ac1b-48e0-b623-e5c783220913	5
d7dc8515-5b2c-4cb3-8368-f7d7085570ad	07:30:00	120	772a9123-7b9f-4b18-ac11-dd3dc9846fa8	3
4f17199c-61b2-46d0-9ccc-6f58df7f1131	07:30:00	120	772a9123-7b9f-4b18-ac11-dd3dc9846fa8	6
d2b15122-a520-4db8-8854-6e3d75174899	13:00:00	120	7b094336-851e-423a-a678-3a408f19d3aa	2
d1f91f32-4386-42bf-a51a-325e896fc47b	07:00:00	120	df1d6dd3-543d-49ae-a156-d023858db683	2
9e19238b-624d-4554-823d-d57f252cbcd8	07:00:00	120	df1d6dd3-543d-49ae-a156-d023858db683	4
c2664f96-17ca-4a9e-b7b5-eccbba0a039e	10:00:00	120	b9969715-b119-4933-b8ba-d5a50138a67f	2
cb3ff32e-7f6d-4d99-9bcd-6f0e3ffce0ac	10:00:00	120	b9969715-b119-4933-b8ba-d5a50138a67f	5
a3e36460-0f52-4915-be28-89daf58dfb6c	07:10:00	90	977e379d-1ba8-4460-a162-bdc04b141470	3
\.


--
-- Data for Name: location; Type: TABLE DATA; Schema: public; Owner: trungquoc
--

COPY public.location (id, name, tutor_id, districts_id) FROM stdin;
39cfb5e3-622a-43d2-858e-e90dfe36ace8	Quận 5	f465de70-2999-462c-86d5-89fdd80824e1	774
adfc3073-5cf8-419f-9320-780081ca7f19	Quận 8	f465de70-2999-462c-86d5-89fdd80824e1	776
89c0c351-ffed-4bf1-8b0a-445148122426	Thành phố Thủ Đức	f465de70-2999-462c-86d5-89fdd80824e1	769
6ab4a320-6b3c-4c7b-bc64-02d76902bafd	Quận 8	64fbfae3-cfd8-4bea-95c1-a84544bbad01	776
e0b47563-8080-4dc2-af1b-f58231d164b1	Quận 5	64fbfae3-cfd8-4bea-95c1-a84544bbad01	774
2212d278-fe20-4ef6-a06d-ecb6ea4bca1c	Quận 7	64fbfae3-cfd8-4bea-95c1-a84544bbad01	778
759bf0fe-eedc-4688-9c41-b852f96dfcb0	Quận 7	f3113397-826c-4602-ac7e-35e6d8b1bd28	778
9d77b531-daa5-46d3-af75-42d30faf31b3	Quận 8	f3113397-826c-4602-ac7e-35e6d8b1bd28	776
51231167-19c2-405c-a974-d6caff07761b	Huyện Hóc Môn	812ad0a6-03d2-40c3-bb82-ad1b6c0bcbd8	784
cd44f6f1-452a-4054-b94b-7e1b1dd672bb	Quận Bình Tân	812ad0a6-03d2-40c3-bb82-ad1b6c0bcbd8	777
1fd69e19-6d69-4179-8303-b053c6e0ab12	Quận 4	6d5e5a64-d333-44be-9e12-ae63e709065b	773
cf3f14f7-f301-4d02-91a2-4a6e6ff0014d	Quận 6	6d5e5a64-d333-44be-9e12-ae63e709065b	775
d5af2948-5d9d-4c8b-ac69-b504203a9f3c	Quận 3	6d5e5a64-d333-44be-9e12-ae63e709065b	770
7005e665-5427-4e67-a5a2-f9bc31ff69ce	Quận 1	3bce4a01-f674-4bf1-b77b-9f35c2258087	760
dd30dafc-5df1-4798-85b7-d9b7f95f608a	Quận Bình Thạnh	3bce4a01-f674-4bf1-b77b-9f35c2258087	765
1c274d5e-b27c-4aa2-81eb-767906f4cf28	Quận Bình Tân	3bce4a01-f674-4bf1-b77b-9f35c2258087	777
282738e7-a18d-4ea1-963d-8a8af13fc1b5	Quận 4	7a2e56f6-16ee-4d2e-aaef-3644bd3ef5f3	773
1e4b6ae1-cf12-4d8a-97b4-72262af0554b	Quận 3	7a2e56f6-16ee-4d2e-aaef-3644bd3ef5f3	770
1d64cfa1-95ba-4f3b-ba7d-ae96901402a2	Quận 1	7a2e56f6-16ee-4d2e-aaef-3644bd3ef5f3	760
3e1f728a-bff5-4049-b454-34617217ac21	Quận 6	cfa918c7-321f-4648-a3da-d0ebc775d1d7	775
942c347d-077b-49ef-bf87-6f9e3831e12e	Quận 7	cfa918c7-321f-4648-a3da-d0ebc775d1d7	778
63f089d7-cc7a-4840-9829-94716bfc5f1c	Quận 8	cfa918c7-321f-4648-a3da-d0ebc775d1d7	776
e0329348-3b2b-4d7c-b8c7-ee1318e2e367	Quận 7	eda2966b-2ddd-4f2e-b956-deab51e35cc0	778
79e87da9-0ea0-4699-8682-1b37f51692b3	Quận 12	eda2966b-2ddd-4f2e-b956-deab51e35cc0	761
a316fb5f-4727-4d85-b891-5955c6a985ea	Quận 11	eda2966b-2ddd-4f2e-b956-deab51e35cc0	772
4a535680-4a3e-4cfb-b50d-e2c43bebce81	Quận 5	e656627c-df44-4304-8122-b2c899891a4a	774
7ed42864-7296-4fc4-ac19-89b0601686c8	Quận 6	e656627c-df44-4304-8122-b2c899891a4a	775
7726acf0-6a4c-4194-bec6-0caf8f6897a0	Quận 7	e656627c-df44-4304-8122-b2c899891a4a	778
2266021b-f22c-419f-b107-3de02153794c	Quận 3	f7999645-2a75-47e7-8245-209818b69046	770
17fd0a86-2f7c-4178-9eac-9875760c1ebb	Quận 5	f7999645-2a75-47e7-8245-209818b69046	774
c35205f6-4e6b-4f43-891d-c278cf12179e	Quận 4	f7999645-2a75-47e7-8245-209818b69046	773
19b95d26-6eb4-48a2-967d-2bc71cb17c7e	Quận 5	5a58dd8b-d237-4346-a344-2d2743fab5a1	774
b15fed63-ee10-46b8-b4fa-811fe989e065	Quận 4	5a58dd8b-d237-4346-a344-2d2743fab5a1	773
1b77b298-3f76-4f86-8b2c-ad2f48988d31	Quận 5	635214c9-7f30-4a7a-99ab-13dc005f2959	774
141a701d-bddc-4f55-8c65-1a12a1da933c	Quận 4	635214c9-7f30-4a7a-99ab-13dc005f2959	773
23254a25-b668-4af3-bc95-5a10d41dec80	Quận 3	635214c9-7f30-4a7a-99ab-13dc005f2959	770
\.


--
-- Data for Name: otp; Type: TABLE DATA; Schema: public; Owner: trungquoc
--

COPY public.otp (id, code, email, create_at) FROM stdin;
67a42d6d-c80e-4ebe-9b99-f6a6b517fd43	190158	wontthe1009@gmail.com	2024-07-30 03:24:30.794896
ab9136a1-bdca-4df6-944c-7e5eb4954d39	864367	vanatran@gmail.com	2024-07-30 08:59:46.722845
74cb09b3-18a4-4290-94c8-c066ebff76b2	111030	vancan@gmail.com	2024-08-10 15:27:41.469773
1f6d1495-1f9e-4591-b23e-2ed1f21d0691	902337	ductien@gmail.com	2024-08-10 15:31:35.236184
33d61d2e-796d-49ec-8dca-c60bbed538d3	832707	thanhnhan@gmail.com	2024-08-11 11:46:51.108361
14b1b1c0-b632-4249-88a4-e66599053d00	552426	thanhnhan@gmail.com	2024-08-11 11:50:26.699203
\.


--
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: trungquoc
--

COPY public.student (id, grade_level, user_id) FROM stdin;
85b08dbc-a4f4-4a16-b103-6bfcc4271c22	7	4a520320-8f6e-49ac-88e7-11a0c1c947c4
1d142db0-1e12-4045-b9da-fad061faedb6	4	fc90500a-14eb-429a-b136-8e86d3eb3c75
7e5db950-cc99-4ca1-8e76-63bc6e4ab884	11	63a2fcae-478b-419f-8235-a1403e04dc16
2831737c-eb88-4da0-8886-4109854da823	2	5ec937ea-5292-45c1-9ebe-ad10c9f33ed7
\.


--
-- Data for Name: student_teaching_subject_map; Type: TABLE DATA; Schema: public; Owner: trungquoc
--

COPY public.student_teaching_subject_map (id, student_id, teaching_subject_id, order_id, amount, trans_id, status, order_date) FROM stdin;
d5f4e22c-0d39-4770-8810-e485edb63a6f	85b08dbc-a4f4-4a16-b103-6bfcc4271c22	7b094336-851e-423a-a678-3a408f19d3aa	MOMO1722302627242	300000.00	4090915256	0	2024-07-30
72102d25-4d3c-447d-b343-8f1f05ed0348	85b08dbc-a4f4-4a16-b103-6bfcc4271c22	a290c5c7-354e-46e6-a584-099cc0cecf31	MOMO1722304165419	2000000.00	\N	1	2024-07-30
\.


--
-- Data for Name: subject; Type: TABLE DATA; Schema: public; Owner: trungquoc
--

COPY public.subject (id, name) FROM stdin;
9264d528-7af8-4c20-a311-54e714694d59	Toán
ab9873db-80c4-4365-a79f-c096c99cfd31	Tiếng Việt
12c08081-68be-4110-a6df-924ab56fd577	Đạo Đức
78eb426c-5d02-4d85-ae99-370b36f80208	Tự Nhiên và Xã Hội
52d64a54-62f1-437a-8b9d-439d04bdaa68	Mĩ Thuật
6da58163-8391-4a50-af89-530c62349213	Âm Nhạc
0a73d8f5-8b50-4840-846d-bb2c680f741c	Thể Dục
d63f5f4b-8eca-4910-b47c-c20bb0b571b9	Ngữ Văn
edec716e-4f68-43b7-af2d-da27205aa28d	Tiếng Anh
0476dab7-47bb-445b-8faf-d9d122e87f25	Lịch Sử
86511410-a718-4073-983b-2c1f263de831	Địa Lý
b9f49567-7085-46cd-9816-94e18ff0befd	Sinh Học
83b75d81-4190-46d3-bcab-d1323b5fccff	Vật Lý
c62324ef-bd32-4854-8c06-8e8ddb7022e4	Hóa Học
c223d3cc-d6c7-4d6b-827a-3c5c5873b8c9	Công Nghệ
4bf6c788-f2e5-4d50-974f-0fe901ab705d	Tin Học
a25e0c83-596f-4f12-a999-c13a8f07d20b	Giáo Dục Công Dân
e9a110f0-df77-427a-8b96-c51a2d966135	Nghệ Thuật
6edc452a-4736-42b4-9814-68d7dde39ce4	Khoa Học Tự Nhiên
2fbdc3c0-5320-43a7-8acb-acfbc176d979	Khoa Học Xã Hội
\.


--
-- Data for Name: teaching_subject; Type: TABLE DATA; Schema: public; Owner: trungquoc
--

COPY public.teaching_subject (id, name, instructor_id, subject_id, description, start_date, number_of_sessions, location_id, price, status, specific_address) FROM stdin;
2fdb84cc-ac1b-48e0-b623-e5c783220913	Hoá cơ bản	64fbfae3-cfd8-4bea-95c1-a84544bbad01	c62324ef-bd32-4854-8c06-8e8ddb7022e4	Bổ sung kiến thức cơ bản môn Hoá	2024-08-16	10	776	1000000	1	80 Cao Lỗ
772a9123-7b9f-4b18-ac11-dd3dc9846fa8	Tin học văn phòng	64fbfae3-cfd8-4bea-95c1-a84544bbad01	4bf6c788-f2e5-4d50-974f-0fe901ab705d	Nâng cao kỹ năng tin học văn phòng	2024-08-17	12	776	1000000	2	80 Cao Lỗ
b9969715-b119-4933-b8ba-d5a50138a67f	Bài tập về ADN ARN	812ad0a6-03d2-40c3-bb82-ad1b6c0bcbd8	b9f49567-7085-46cd-9816-94e18ff0befd	công thức, bài tập vận dụng về ADN, ARN	2024-08-13	4	777	2000000	2	32, Phạm Ngũ Lão
df1d6dd3-543d-49ae-a156-d023858db683	tổng quan hợp chất hữu cơ	812ad0a6-03d2-40c3-bb82-ad1b6c0bcbd8	c62324ef-bd32-4854-8c06-8e8ddb7022e4	Sơ lược về hợp chất hữu cơ và ứng dụng	2024-08-17	10	777	10000	1	32, Phạm Ngũ Lão
977e379d-1ba8-4460-a162-bdc04b141470	Vật lý cơ bản	f465de70-2999-462c-86d5-89fdd80824e1	83b75d81-4190-46d3-bcab-d1323b5fccff	Tạo khoá học mới	2024-08-16	10	774	100000	1	80, Đường số 8
a290c5c7-354e-46e6-a584-099cc0cecf31	Vật lý Cơ bản 	f465de70-2999-462c-86d5-89fdd80824e1	83b75d81-4190-46d3-bcab-d1323b5fccff	Khóa học vật lý cơ bản cho học sinh lớp 10.	2024-08-16	12	777	2000000	0	Đường abc, phường 4
7b094336-851e-423a-a678-3a408f19d3aa	Hình học không gian	f465de70-2999-462c-86d5-89fdd80824e1	9264d528-7af8-4c20-a311-54e714694d59	Lý thuyết công thức về hình học trong không gian Oxy	2024-08-21	6	776	300000	0	180 Cao Lỗ
8b3d061d-cfba-4b9b-9288-4bc7b0b11163	Biến thiên hàm số	f465de70-2999-462c-86d5-89fdd80824e1	9264d528-7af8-4c20-a311-54e714694d59	Khảo sát độ biến thiên hàm số\n	2024-08-15	6	774	1000000	0	28, An Dương Vương
\.


--
-- Data for Name: tutor; Type: TABLE DATA; Schema: public; Owner: trungquoc
--

COPY public.tutor (id, education, experience, user_id) FROM stdin;
f465de70-2999-462c-86d5-89fdd80824e1	Cử nhân Sư phạm	Mới tốt nghiệp	27ac7a7a-20a9-4d2c-a070-844f806cfd54
64fbfae3-cfd8-4bea-95c1-a84544bbad01	Sinh viên 	Sinh viên năm 4	388a3b2d-547b-47f8-875a-c5e2fe38ae50
f3113397-826c-4602-ac7e-35e6d8b1bd28	Sinh viên 	Sinh viên năm 2	dc75ce65-4997-4cf4-a85d-337676d74a4f
812ad0a6-03d2-40c3-bb82-ad1b6c0bcbd8	Sinh viên 	Mới tốt nghiệp	7c38c237-78a4-40a2-82c1-28c3836ea785
6d5e5a64-d333-44be-9e12-ae63e709065b	Sư phạm tiểu học	Mới tốt nghiệp	ad28462a-58ce-4fd6-9218-fd92f5ffec47
3bce4a01-f674-4bf1-b77b-9f35c2258087	Cử nhân Sư phạm	3 năm gia sư Hóa	466842f1-bed6-4a75-9393-3e616840b560
7a2e56f6-16ee-4d2e-aaef-3644bd3ef5f3	Thạc sĩ Giáo dục	6 năm gia sư Lý	a545edfb-30db-42f8-b638-6fa154563bc8
cfa918c7-321f-4648-a3da-d0ebc775d1d7	Cử nhân Sư phạm	4 năm gia sư Tiếng Anh	7c7346c1-7664-4706-a8b0-376c119fdb5a
eda2966b-2ddd-4f2e-b956-deab51e35cc0	Cử nhân Giáo dục	5 năm gia sư	94fbad67-5b95-4bec-9a79-24ebf31d155a
e656627c-df44-4304-8122-b2c899891a4a	Cử nhân Sư phạm	4 năm gia sư 	f0bc9b3d-5120-4fd8-a97f-532df1120544
f7999645-2a75-47e7-8245-209818b69046	Cử nhân Sư phạm	4 năm gia sư 	5bd9b740-9bb0-4ede-a848-33bcd365b71b
5a58dd8b-d237-4346-a344-2d2743fab5a1	Cử nhân Sư phạm	4 năm gia sư 	ed3ba72a-4dd4-453f-bb2f-0a60b684bf5c
635214c9-7f30-4a7a-99ab-13dc005f2959	Sinh viên	Mới tốt nghiệp	4e7b634a-b08b-40bb-935b-43fc749e0436
\.


--
-- Data for Name: tutor_subject_map; Type: TABLE DATA; Schema: public; Owner: trungquoc
--

COPY public.tutor_subject_map (id, tutor_id, subject_id) FROM stdin;
6773d153-6941-4e99-89d9-dbe13a4c29dd	f465de70-2999-462c-86d5-89fdd80824e1	9264d528-7af8-4c20-a311-54e714694d59
218d300e-cf30-4f4d-bf1f-0acf596f00b7	f465de70-2999-462c-86d5-89fdd80824e1	83b75d81-4190-46d3-bcab-d1323b5fccff
76c4302c-90e8-466e-9ee6-1af1f454ef72	64fbfae3-cfd8-4bea-95c1-a84544bbad01	9264d528-7af8-4c20-a311-54e714694d59
bdf1ae62-5fb9-4fb4-bfea-0d6256e15b6e	64fbfae3-cfd8-4bea-95c1-a84544bbad01	c62324ef-bd32-4854-8c06-8e8ddb7022e4
42324950-9e3b-4020-9d9e-2d1004d14a54	64fbfae3-cfd8-4bea-95c1-a84544bbad01	4bf6c788-f2e5-4d50-974f-0fe901ab705d
857473b7-f4f4-4b77-bdbd-90f3089c2b77	f3113397-826c-4602-ac7e-35e6d8b1bd28	ab9873db-80c4-4365-a79f-c096c99cfd31
483038a9-445f-464f-accb-84bc9e4bef5c	f3113397-826c-4602-ac7e-35e6d8b1bd28	83b75d81-4190-46d3-bcab-d1323b5fccff
2f6474c8-4330-42c0-b513-976ca2206b58	f3113397-826c-4602-ac7e-35e6d8b1bd28	0a73d8f5-8b50-4840-846d-bb2c680f741c
5e9647c5-6827-48b3-ab8c-cdbeeefc294b	812ad0a6-03d2-40c3-bb82-ad1b6c0bcbd8	b9f49567-7085-46cd-9816-94e18ff0befd
0c09114d-4986-4e88-b1a1-918b664ea49b	812ad0a6-03d2-40c3-bb82-ad1b6c0bcbd8	c62324ef-bd32-4854-8c06-8e8ddb7022e4
4d9be0a3-f596-462f-904c-4304c2232525	6d5e5a64-d333-44be-9e12-ae63e709065b	ab9873db-80c4-4365-a79f-c096c99cfd31
bc953533-7854-4446-a175-49ef74a6ac3f	6d5e5a64-d333-44be-9e12-ae63e709065b	12c08081-68be-4110-a6df-924ab56fd577
b72975ae-c6bc-4872-8940-51cb86041660	6d5e5a64-d333-44be-9e12-ae63e709065b	78eb426c-5d02-4d85-ae99-370b36f80208
64d07423-95d3-4721-9ed6-3773e514d2da	6d5e5a64-d333-44be-9e12-ae63e709065b	c223d3cc-d6c7-4d6b-827a-3c5c5873b8c9
1ae5c977-0257-4d1f-8edc-33f979a31059	3bce4a01-f674-4bf1-b77b-9f35c2258087	c62324ef-bd32-4854-8c06-8e8ddb7022e4
60f2791d-d9c3-4518-8f23-9695f1afdd98	3bce4a01-f674-4bf1-b77b-9f35c2258087	b9f49567-7085-46cd-9816-94e18ff0befd
42d829b0-2afa-4be0-823d-376db7fdcfa8	7a2e56f6-16ee-4d2e-aaef-3644bd3ef5f3	9264d528-7af8-4c20-a311-54e714694d59
794b5bc3-36c8-40d6-95be-f950e7682d0f	7a2e56f6-16ee-4d2e-aaef-3644bd3ef5f3	83b75d81-4190-46d3-bcab-d1323b5fccff
cb3d0d1f-8a33-4b2c-9011-2ceb08bb255f	cfa918c7-321f-4648-a3da-d0ebc775d1d7	edec716e-4f68-43b7-af2d-da27205aa28d
ad479a06-f98a-4637-b9da-781ca64f9036	cfa918c7-321f-4648-a3da-d0ebc775d1d7	2fbdc3c0-5320-43a7-8acb-acfbc176d979
bd647c09-d7d5-47b8-acac-3daad683df6f	eda2966b-2ddd-4f2e-b956-deab51e35cc0	ab9873db-80c4-4365-a79f-c096c99cfd31
22f04496-d39d-4362-a0e5-594ecc920952	eda2966b-2ddd-4f2e-b956-deab51e35cc0	12c08081-68be-4110-a6df-924ab56fd577
d4051e23-4873-4dff-ab9c-bb62d534b8c6	eda2966b-2ddd-4f2e-b956-deab51e35cc0	78eb426c-5d02-4d85-ae99-370b36f80208
9be7d334-3f8b-441a-aea3-b61effc5614e	e656627c-df44-4304-8122-b2c899891a4a	2fbdc3c0-5320-43a7-8acb-acfbc176d979
07b73bdc-85c6-46c1-820d-27df38d4ade8	e656627c-df44-4304-8122-b2c899891a4a	6edc452a-4736-42b4-9814-68d7dde39ce4
6d8df8d0-3b95-43db-90ab-09ac633ed4b0	e656627c-df44-4304-8122-b2c899891a4a	a25e0c83-596f-4f12-a999-c13a8f07d20b
337c8b4f-472d-4dda-bf14-68d008697297	f7999645-2a75-47e7-8245-209818b69046	12c08081-68be-4110-a6df-924ab56fd577
4ed366eb-f935-438c-8cfe-97c82922ab49	f7999645-2a75-47e7-8245-209818b69046	52d64a54-62f1-437a-8b9d-439d04bdaa68
1a2d2c48-e872-4d7d-8160-98647006ec2c	f7999645-2a75-47e7-8245-209818b69046	6da58163-8391-4a50-af89-530c62349213
f4ce75a4-1ee4-4b01-af70-0911f98a84cf	5a58dd8b-d237-4346-a344-2d2743fab5a1	ab9873db-80c4-4365-a79f-c096c99cfd31
2e92907c-6459-49e7-8bbc-e424b27b4219	5a58dd8b-d237-4346-a344-2d2743fab5a1	12c08081-68be-4110-a6df-924ab56fd577
4ba3aa0f-c9f2-4dd1-813e-1a531a598fda	635214c9-7f30-4a7a-99ab-13dc005f2959	9264d528-7af8-4c20-a311-54e714694d59
117e03b3-7e09-4593-a9fd-4a942109026b	635214c9-7f30-4a7a-99ab-13dc005f2959	12c08081-68be-4110-a6df-924ab56fd577
d0cfe990-d904-4f86-81c0-a676eb8c0a36	635214c9-7f30-4a7a-99ab-13dc005f2959	78eb426c-5d02-4d85-ae99-370b36f80208
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: trungquoc
--

COPY public.users (id, name, email, phone_number, age, username, password, role, status, gender) FROM stdin;
5bd9b740-9bb0-4ede-a848-33bcd365b71b	Trần Văn Dục	vanatran@gmail.com	0782478354	25	vana12345	$2a$10$6yru3AQirfV9UNc7fy81DOpXLsLzHFUk81zKTScSw2rHYGmLkiYay	1	1	1
4e7b634a-b08b-40bb-935b-43fc749e0436	Nguyễn Thanh Nhân	thanhnhan@gmail.com	0123456789	23	thanhnhan123	$2a$10$VIwIk6azloBRY20t6SRXceHqmdkZM5A71e4MbJpp1cpttt3zBqWne	1	2	2
27ac7a7a-20a9-4d2c-a070-844f806cfd54	Trần Thị Huỳnh Yến	huynhyen@gmail.com	0375066881	22	huynhyen123	$2a$10$lrdNkI.wTZWZKW/M4WAF3eVbNn3mRuKVJTUnkHQG3LpYs3wu4oU1i	1	1	2
850eafde-6865-462a-8666-54ee81c1d735	Admin	wontthe1009@gmail.com	0912345678	20	admin123	$2a$10$Sa4Dkkz.Cba6FxyAI2.Ku.b.51FAhUmsNLQTTkKb9l4oS/5oJ0BSC	0	1	1
388a3b2d-547b-47f8-875a-c5e2fe38ae50	Văn Bảo Tâm	baotam@gmail.com	0338005958	22	baotam123	$2a$10$wBIqfxx26KTqjDjbC6QQVesEKsdGk.hEu8nNLW8/t3ToQjc7P8WQW	1	1	1
466842f1-bed6-4a75-9393-3e616840b560	Đỗ Thị Yến	thiyendo@gmail.com	0901234571	24	thiyen123	$2a$10$y04nAu/VdG3wvESE75g7.OV13iN8vLhrptxeZZ9CaoFV0XCrrWlee	1	1	2
4a520320-8f6e-49ac-88e7-11a0c1c947c4	Trần Đức Hải	duchai@gmail.com	0869289766	12	duchai123	$2a$10$FnswpNnawFzm5rJMAxJy0.rLxaEyKn2NRumD5g4zx08p7oge4GNom	2	1	1
5ec937ea-5292-45c1-9ebe-ad10c9f33ed7	Lê Thị Quỳnh	thiquynhle@gmail.com	0967890126	7	thiquynh123	$2a$10$ooFBNMtgz51.zzmYGEi24..UgS5IHNs/ZVIocG.5h4vu1mDlxSFMe	2	1	2
63a2fcae-478b-419f-8235-a1403e04dc16	Hoàng Anh Tuấn	anhtuanhoang@gmail.com	0923456792	16	anhtuan123	$2a$10$JgGEqxu.iKTyZeI9Vic07uN0z6u2iLZ5saREiccSPEy6oBNaLNZmq	2	1	1
7c38c237-78a4-40a2-82c1-28c3836ea785	Nguyễn Thị Trúc Linh	truclinh@gmail.com	0782478353	22	truclinh123	$2a$10$lx60bPMU3iwTItRBvqDj7exGe5vWnvpM0v2rHbEtVGCKBAK1PNqQS	1	1	2
94fbad67-5b95-4bec-9a79-24ebf31d155a	Trần Văn Lâm	vanlamtran@gmail.com	0934567893	30	vanlam123	$2a$10$cc8tOMg5gECDiMilKcN7auTmUHP3d08QnrRitS6/iwtyAG0oIHjzG	1	1	1
ad28462a-58ce-4fd6-9218-fd92f5ffec47	Nguyễn Văn Nam	vannamnguyen@gmail.com	0912345677	24	vannam123	$2a$10$NrCRJm11sgM1F8HLAHgN2u00pi3Mn18n3d2yoHAnKvf5fUavNu1AW	1	1	1
fc90500a-14eb-429a-b136-8e86d3eb3c75	Võ Hữu Tâm	huutamvo@gmail.com	0987123459	12	huutam123	$2a$10$VEsVrA0lJZHHQwlWCIbjl.l8.44A/vuzFiPdaQ2854O2t8zBcR6.C	2	1	1
dc75ce65-4997-4cf4-a85d-337676d74a4f	Phan Đức Tiến	ductien@gmail.com	0866629019	22	ductien123	$2a$10$o4eUJpAAkzbsYfmzMwaJY.dsw.dlRf3flgQoiTGanTw.qyngf5vc.	1	1	2
ed3ba72a-4dd4-453f-bb2f-0a60b684bf5c	Trần Văn Nhân	vancan@gmail.com	0782478351	24	vancan123	$2a$10$aWI0Pdz6IILAnytEECjC8.bJj5UTSNOrHOpyLuxZVaA8ddvuvRSK.	1	1	1
a545edfb-30db-42f8-b638-6fa154563bc8	Bùi Văn Hải Nhân	vanhaibui@gmail.com	0987654332	25	vanhai123	$2a$10$BJyn25d1vuo21d/wYdp/gOOt0EWTHM0YFNkppBK81sSKu.xzMTb5O	1	1	1
7c7346c1-7664-4706-a8b0-376c119fdb5a	Đặng Thị Minh	thiminhdang@gmail.com	0912348768	26	thiminh123	$2a$10$wa6tK8yGITpsyintVVxYVe2vX7mQi3SFsV0cFtZCHkZ7cel.PG1my	1	1	2
f0bc9b3d-5120-4fd8-a97f-532df1120544	Nguyễn Thị Nhung	thinungnguyen@gmail.com	0976543221	23	thinhung123	$2a$10$dZ9CNIHs2iMk9m9sD35EhORbrXih29hyFjerA2qUOCIPVO3mYhtNe	1	1	2
\.


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
-- PostgreSQL database dump complete
--

