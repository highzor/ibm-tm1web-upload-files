<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
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
<%
    // загрузка файла в хранилище Cognos
    String applicationFolder = getApplicationFolder(application, request);
	File inputFile = new File(applicationFolder + "\\config.xml");
    DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
    DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
    Document doc = dBuilder.parse(inputFile);
    doc.getDocumentElement().normalize();
    String configPath = doc.getElementsByTagName("Path").item(0).getTextContent();
%>
<%!
    boolean nameExists(String serverName,String formname, String fileName, String configPath) throws FileNotFoundException, IOException
    {
        String logFileName = "remove.txt";
        String pathForJSON = configPath + serverName +"\\"+ formname +  "\\attachments\\logs\\" + logFileName;
		if(!Files.exists(Paths.get(pathForJSON)))
            return false;
        FileReader reader = new FileReader(pathForJSON);
        BufferedReader bufRead = new BufferedReader(reader);
        String myLine = null;
        String tempName;

        while ((myLine = bufRead.readLine()) != null) {

            String[] array1 = myLine.split(":");
            tempName = array1[3].substring(1, array1[3].length() - 3);
            if(tempName.equals(fileName))
                return true;
        }
        return false;
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
<%
	request.setCharacterEncoding("UTF-8");
	String serverName = request.getParameter("serverName");
	String formname = request.getParameter("formname");
	String currentDate = request.getParameter("currentDate");
	String uploadedFolder = configPath + serverName +"\\"+ formname + "\\attachments\\";
	String uploadedFolderLog = configPath + serverName +"\\"+ formname + "\\attachments\\logs\\";
	Files.createDirectories(Paths.get(uploadedFolder));
	Files.createDirectories(Paths.get(uploadedFolderLog));

    Part p = request.getPart("file");
    InputStream inputStream = null;
    if (p != null) {
        inputStream = p.getInputStream();
    }

	byte[] bytes = new byte[inputStream.available()];
	inputStream.read(bytes);
	StringBuilder tempStr = new StringBuilder(p.getSubmittedFileName());

	Path path = Paths.get(uploadedFolder + tempStr);
    StringBuilder fileName = tempStr;

	if(Files.exists(path) || nameExists(serverName,formname, fileName.toString(), configPath))
        for(int i = 1; ; i++) {
           fileName = new StringBuilder (tempStr.substring(0, tempStr.lastIndexOf(".")) + '(' + i + ')' + tempStr.substring(tempStr.lastIndexOf(".")));
           path = Paths.get(uploadedFolder + fileName);
           if(!Files.exists(path) && !nameExists(serverName,formname, fileName.toString(), configPath))
               break;
        }

    Files.write(path, bytes);

    String sizeStr;
    if (p.getSize() < 1024) sizeStr = p.getSize() + " B";
    else {
	int z = (63 - Long.numberOfLeadingZeros(p.getSize())) / 10;
    sizeStr = String.format("%.2f %sB", (double)p.getSize() / (1L << (z*10)), " KMGTPE".charAt(z));}
	out.print("{\"formname\": \"" + formname+ "\", \"size\": \"" + sizeStr+ "\", \"name\": \"" + fileName.toString() +"\"}");
		
%>
