<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@page import="java.io.IOException"%>
<%@page import="java.io.PrintWriter"%>
<%@ page import="java.sql.*" %>
<%@ page import="java.io.OutputStream" %>
<%@ page import="java.io.InputStreamReader" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.Date" %>
<%@ page import="java.util.Scanner" %>

<% 
String url = "jdbc:sqlserver://10.40.10.138;user=TestB;password=123456789";
Connection con = DriverManager.getConnection(url);
request.setCharacterEncoding("UTF-8");
String event= request.getParameter("event").trim();
String title= request.getParameter("title").trim();
Date date = new Date(request.getParameter("dateTime"));
java.sql.Time sqlTime = new java.sql.Time(date.getTime());
java.sql.Date sqlDate = new java.sql.Date(date.getTime());
String user= request.getParameter("user");
	
String SQL = "INSERT INTO TM1_LOGS.dbo.LOG_EVENTS (APPLICATION,USERNAME,DATE,TIME,ACTION) VALUES (?,?,?,?,?)";

PreparedStatement preparedStatement = con.prepareStatement(SQL);
preparedStatement.setString(1, title);
preparedStatement.setString(2, user);
preparedStatement.setDate(3,sqlDate);
preparedStatement.setTime(4,sqlTime);
preparedStatement.setString(5, event);


preparedStatement.executeUpdate();

response.setContentType("application/octet-stream; charset=UTF-8");
response.setCharacterEncoding("UTF-8");

con.close();
%>