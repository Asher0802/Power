-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 2016-10-07 15:44:03
-- 服务器版本： 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `flower`
--

-- --------------------------------------------------------

--
-- 表的结构 `flower_comment`
--

CREATE TABLE IF NOT EXISTS `flower_comment` (
  `c_id` int(10) NOT NULL AUTO_INCREMENT COMMENT '评论id',
  `c_content` text NOT NULL COMMENT '评论内容',
  `c_product_id` int(10) NOT NULL COMMENT '产品id',
  `c_status` enum('ok','del') NOT NULL DEFAULT 'ok' COMMENT '状态',
  `c_aud` enum('未审核','审核通过','审核未通过') NOT NULL DEFAULT '未审核' COMMENT '审核状态',
  `c_time` varchar(13) NOT NULL COMMENT '添加时间',
  PRIMARY KEY (`c_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='评论表' AUTO_INCREMENT=13 ;

--
-- 转存表中的数据 `flower_comment`
--

INSERT INTO `flower_comment` (`c_id`, `c_content`, `c_product_id`, `c_status`, `c_aud`, `c_time`) VALUES
(1, '这个网站做的太好了，可以获得一手的花木信息，简直就是良心之作啊', 1, 'ok', '审核未通过', '1462782746'),
(2, '我觉得可以成功的', 1, 'ok', '审核通过', '1464171540'),
(3, '评论一下', 3, 'ok', '未审核', '1464883448'),
(4, '你好', 3, 'ok', '未审核', '1464883819'),
(5, '', 3, 'del', '未审核', '1465054394'),
(6, '', 0, 'del', '未审核', '1465054396'),
(7, '', 0, 'del', '未审核', '1465054399'),
(8, '123', 3, 'ok', '未审核', '1465054701'),
(9, 'eqw', 3, 'ok', '未审核', '1465054857'),
(10, '123', 3, 'ok', '审核通过', '1465055563'),
(11, '测试 数据', 4, 'ok', '未审核', '1465729493'),
(12, '发表评论。。。。。', 2, 'ok', '审核通过', '1465776366');

-- --------------------------------------------------------

--
-- 表的结构 `flower_img`
--

CREATE TABLE IF NOT EXISTS `flower_img` (
  `i_id` int(10) NOT NULL AUTO_INCREMENT COMMENT '图片id',
  `i_url` varchar(200) NOT NULL COMMENT '图片地址',
  `i_pid` int(10) NOT NULL COMMENT '产品id',
  `i_status` enum('ok','del') NOT NULL DEFAULT 'ok' COMMENT '图片状态',
  `i_time` varchar(13) NOT NULL COMMENT '添加时间',
  PRIMARY KEY (`i_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='图片表' AUTO_INCREMENT=15 ;

--
-- 转存表中的数据 `flower_img`
--

INSERT INTO `flower_img` (`i_id`, `i_url`, `i_pid`, `i_status`, `i_time`) VALUES
(3, './Uploads/2016/05/14630400490203.jpg', 1, 'ok', '1463040049'),
(4, './Uploads/2016/05/14630401009026.jpg', 1, 'ok', '1463040100'),
(5, './Uploads/2016/05/14630401459286.jpg', 1, 'ok', '1463040145'),
(6, './Uploads/2016/05/14630401804308.jpg', 1, 'ok', '1463040180'),
(7, './Uploads/2016/05/14630411755955.jpg', 1, 'ok', '1463041175'),
(8, './Uploads/2016/05/14630412598949.jpg', 1, 'ok', '1463041259'),
(9, './Uploads/2016/05/14631929064562.jpg', 1, 'ok', '1463192906'),
(10, './Uploads/2016/05/14646045787781.jpg', 2, 'ok', '1464604578'),
(11, './Uploads/2016/05/14646047027119.jpg', 3, 'ok', '1464604702'),
(12, './Uploads/2016/05/14646047777158.jpg', 4, 'ok', '1464604777'),
(13, './Uploads/2016/05/14646138295617.jpg', 5, 'ok', '1464613830'),
(14, './Uploads/2016/06/14657762743833.jpg', 5, 'ok', '1465776274');

-- --------------------------------------------------------

--
-- 表的结构 `flower_org`
--

CREATE TABLE IF NOT EXISTS `flower_org` (
  `org_id` int(10) NOT NULL AUTO_INCREMENT COMMENT '公司id',
  `org_name` varchar(200) NOT NULL COMMENT '公司名称',
  `org_user` varchar(200) NOT NULL COMMENT '店主',
  `org_tel` varchar(11) NOT NULL COMMENT '手机',
  `org_qq` varchar(11) NOT NULL COMMENT 'qq',
  `org_addr` varchar(200) NOT NULL COMMENT '地址',
  `org_status` enum('ok','del') NOT NULL DEFAULT 'ok' COMMENT '公司状态',
  `org_time` varchar(13) NOT NULL COMMENT '添加时间',
  PRIMARY KEY (`org_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='公司表' AUTO_INCREMENT=3 ;

--
-- 转存表中的数据 `flower_org`
--

INSERT INTO `flower_org` (`org_id`, `org_name`, `org_user`, `org_tel`, `org_qq`, `org_addr`, `org_status`, `org_time`) VALUES
(1, '绝对领域', '吴晗', '15110357976', '476794913', '山西临汾', 'ok', '1462782746'),
(2, '测试', '吴晗', 'AC', '尾萼蔷薇', '山西', 'del', '1465776675');

-- --------------------------------------------------------

--
-- 表的结构 `flower_product`
--

CREATE TABLE IF NOT EXISTS `flower_product` (
  `p_id` int(10) NOT NULL AUTO_INCREMENT COMMENT '产品id',
  `p_name` varchar(200) NOT NULL COMMENT '产品名称',
  `p_org_id` int(10) NOT NULL COMMENT '公司id',
  `p_type_id` int(10) NOT NULL COMMENT '分类id',
  `p_price` varchar(100) NOT NULL COMMENT '价格',
  `p_img` varchar(200) NOT NULL COMMENT '图片',
  `p_remark` text NOT NULL COMMENT '描述',
  `p_addr` varchar(200) NOT NULL COMMENT '产地',
  `p_status` enum('ok','del') NOT NULL DEFAULT 'ok' COMMENT '状态',
  `p_time` varchar(13) NOT NULL COMMENT '添加时间',
  PRIMARY KEY (`p_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='产品表' AUTO_INCREMENT=6 ;

--
-- 转存表中的数据 `flower_product`
--

INSERT INTO `flower_product` (`p_id`, `p_name`, `p_org_id`, `p_type_id`, `p_price`, `p_img`, `p_remark`, `p_addr`, `p_status`, `p_time`) VALUES
(1, '常青树', 1, 2, '200', './Uploads/2016/05/14630401009026.jpg', '可以长得很好很好', '山西临汾', 'ok', '1462790373'),
(2, '玫瑰花', 1, 3, '200', './Uploads/2016/05/14646045787781.jpg', '你知道吗，玫瑰象征爱情', '山西临汾', 'ok', '1464604565'),
(3, '龙井盆栽', 1, 1, '200', './Uploads/2016/05/14646047027119.jpg', '龙井的故乡在杭州，我去过', '山西临汾', 'ok', '1464604677'),
(4, '槐树', 1, 4, '2000', './Uploads/2016/05/14646047777158.jpg', '大槐树是故乡啊', '山西临汾', 'ok', '1464604763'),
(5, '茉莉花', 1, 3, '300', './Uploads/2016/06/14657762743833.jpg', '好一朵美丽饿茉莉花', '山西临汾', 'ok', '1464613745');

-- --------------------------------------------------------

--
-- 表的结构 `flower_type`
--

CREATE TABLE IF NOT EXISTS `flower_type` (
  `t_id` int(10) NOT NULL AUTO_INCREMENT COMMENT '分类id',
  `t_name` varchar(200) NOT NULL COMMENT '分类名称',
  `t_status` enum('ok','del') NOT NULL DEFAULT 'ok' COMMENT '状态',
  `t_time` varchar(13) NOT NULL COMMENT '添加时间',
  PRIMARY KEY (`t_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- 转存表中的数据 `flower_type`
--

INSERT INTO `flower_type` (`t_id`, `t_name`, `t_status`, `t_time`) VALUES
(1, '盆栽', 'ok', '1462783630'),
(2, '苗木', 'ok', '1462783718'),
(3, '蔷薇', 'ok', '1462783718'),
(4, '林木', 'ok', '1462783718');

-- --------------------------------------------------------

--
-- 表的结构 `flower_user`
--

CREATE TABLE IF NOT EXISTS `flower_user` (
  `u_id` int(10) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `u_name` varchar(200) NOT NULL COMMENT '用户账号',
  `u_realname` varchar(200) NOT NULL COMMENT '用户名',
  `u_password` varchar(200) NOT NULL COMMENT '密码',
  `u_status` enum('del','ok') NOT NULL DEFAULT 'ok' COMMENT '用户状态',
  `u_time` varchar(13) NOT NULL COMMENT '添加时间',
  PRIMARY KEY (`u_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='用户表' AUTO_INCREMENT=5 ;

--
-- 转存表中的数据 `flower_user`
--

INSERT INTO `flower_user` (`u_id`, `u_name`, `u_realname`, `u_password`, `u_status`, `u_time`) VALUES
(1, 'asher', '吴寒', '1234qaz', 'ok', '12412314'),
(2, 'hot', '吴晗', '1234qaz', 'del', '1462781896'),
(3, 'ice', '吴彪', '123456', 'ok', '1462782118'),
(4, 'hot', '测试', '123456', 'ok', '1465202337');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
