<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@page import="java.io.InputStream"%>
<%@page import="java.nio.file.Files"%>
<%@page import="java.nio.file.Path"%>
<%@page import="java.nio.file.Paths"%>
<%@ page import="java.util.Date" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="java.io.*" %>
<%@ page import="javax.xml.parsers.DocumentBuilderFactory" %>
<%@ page import="javax.xml.parsers.DocumentBuilder" %>
<%@ page import="org.w3c.dom.Document" %>
<%@ page import="java.io.InputStreamReader" %>
<%@ page import="java.io.OutputStream" %>
<%@ page import="java.io.PrintWriter" %>
<%@ page import="java.net.URLEncoder" %>
<%
    // '.jsp' скачивающий файл
    String applicationFolder = getApplicationFolder(application, request);
	File inputFile = new File(applicationFolder + "\\config.xml");
    DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
    DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
    Document doc = dBuilder.parse(inputFile);
    doc.getDocumentElement().normalize();
    String configPath = doc.getElementsByTagName("Path").item(0).getTextContent();

	request.setCharacterEncoding("UTF-8");
    String filename = request.getParameter("fileName");
	String formname = request.getParameter("formname");
    String filepath = configPath + request.getParameter("serverName") +"\\"+request.getParameter("formname")+ "\\attachments\\";
    response.setContentType("application/octet-stream; charset=UTF-8");
    response.setCharacterEncoding("UTF-8");
    response.setHeader("Content-Disposition","attachment; filename*=UTF-8''" + URLEncoder.encode(filename, "UTF-8"));

    java.io.FileInputStream fileInputStream=new java.io.FileInputStream(filepath + filename);
    OutputStream os1 = response.getOutputStream();

    int i;
    while ((i=fileInputStream.read()) != -1) {
        os1.write(i);
    }
    out.println(os1);
    fileInputStream.close();
    os1.flush();
    os1.close();
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