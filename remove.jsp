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
<%@ page import="java.nio.file.StandardOpenOption" %>
<%@ page import="java.nio.charset.StandardCharsets" %>
<%@ page import="java.util.Arrays" %>
<%
    // удаление файла из хранилища Cognos
    String applicationFolder = getApplicationFolder(application, request);
	File inputFile = new File(applicationFolder + "\\config.xml");
    DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
    DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
    Document doc = dBuilder.parse(inputFile);
    doc.getDocumentElement().normalize();
    String configPath = doc.getElementsByTagName("Path").item(0).getTextContent();
	
    request.setCharacterEncoding("UTF-8");
    String user = request.getParameter("user");
	String formname = request.getParameter("formname");
    String logFileName = "remove.txt";
    Date currDate = new Date();
    SimpleDateFormat formatForCurrDate = new SimpleDateFormat("yyyy.MM.dd-HH.mm.ss");
    // собираем данные из 'request
    String fileName = request.getParameter("fileName");
    String serverName = request.getParameter("serverName");
    Path path = Paths.get(configPath + serverName + "\\" +formname +   "\\attachments\\" + fileName);
    Path logPath = Paths.get(configPath + serverName + "\\" +formname + "\\attachments\\logs\\" + logFileName);

    String logEntry = "{\"user\":\"" + user + "\",\"datetime\":\"" + formatForCurrDate.format(currDate) + "\",\"name\":\"" + fileName +"\"},";

	//Files.write(logPath, Arrays.asList(logEntry),Files.exists(logPath) ? StandardOpenOption.APPEND : StandardOpenOption.CREATE);

	Files.write(logPath, Arrays.asList(logEntry), StandardCharsets.UTF_8, Files.exists(logPath) ? StandardOpenOption.APPEND : StandardOpenOption.CREATE);
	
    if(!Files.exists(path)) {
        out.print("File does not exist");
		out.flush();
	}
    else {
		Files.delete(path);
		response.setContentType("application/text");
        response.setCharacterEncoding("UTF-8");
        out.print(removeLastChar(logEntry));
        out.flush();
	}
%>

<%! 
    public static String removeLastChar(String s) {
		return (s == null || s.length() == 0) ? null : (s.substring(0, s.length() - 1));
	}
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