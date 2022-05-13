<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@page import="java.io.IOException"%>
<%@page import="java.io.PrintWriter"%>
<%@ page import="java.sql.*" %>
<%@ page import="java.io.OutputStream" %>
<%@ page import="java.io.InputStreamReader" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.Date" %>
<%@ page import="java.util.Scanner" %>
<%@page import="java.io.InputStream"%>
<%@page import="java.nio.file.Files"%>
<%@page import="java.nio.file.Path"%>
<%@page import="java.nio.file.Paths"%>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="java.io.*" %>
<%@ page import="javax.xml.parsers.DocumentBuilderFactory" %>
<%@ page import="javax.xml.parsers.DocumentBuilder" %>
<%@ page import="org.w3c.dom.Document" %>
<%
    String applicationFolder = getApplicationFolder(application, request);
	File inputFile = new File(applicationFolder + "\\config.xml");
    DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
    DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
    Document doc = dBuilder.parse(inputFile);
    doc.getDocumentElement().normalize();
    String configPath = doc.getElementsByTagName("sql").item(0).getTextContent();
%>
<% 
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

<%!
    // метод формирования пути, откуда запускается текущий '.jsp'
    public static String getApplicationFolder(ServletContext application, HttpServletRequest request) throws Exception {

		String requestPath = request.getRequestURI().toString();
		String appPath = application.getRealPath("").toString();
		int first = requestPath.indexOf('/');
		int second = requestPath.indexOf('/', first + 1);
		String applicationFolder = appPath + requestPath.substring(second).replace('/', '\\');
		applicationFolder = applicationFolder.substring(0, applicationFolder.lastIndexOf('\\'));
		return applicationFolder;
	}
%>