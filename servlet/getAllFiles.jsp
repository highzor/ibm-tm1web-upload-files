<%@ page trimDirectiveWhitespaces="true"%>
<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@page import="java.io.InputStream"%>
<%@page import="java.nio.file.Files"%>
<%@page import="java.nio.file.Path"%>
<%@page import="java.nio.file.Paths"%>
<%@ page import="java.io.*"%>
<%@ page import="javax.xml.parsers.DocumentBuilder"%>
<%@ page import="javax.xml.parsers.DocumentBuilderFactory"%>
<%@ page import="java.nio.charset.StandardCharsets"%>
<%@ page import="java.util.Arrays"%>
<%@ page import="java.util.zip.*"%>
<%@ page import="java.net.URLEncoder"%>
<%
// собираем данные из 'request'
request.setCharacterEncoding("UTF-8");
String serverName = request.getParameter("serverName");
String formname = request.getParameter("formname");
String user = request.getParameter("user");
String[] fileNames = request.getParameter("fileNames").split("!=-=!");
String applicationFolder = getApplicationFolder(application, request);

if (serverName != null && formname != null && fileNames.length > 0) {

	String rootPath = getRootPath(serverName, formname, applicationFolder);
	
	response.setContentType("application/x-msdownload");
    response.setHeader("Content-Disposition", "attachment; filename=\"MyZip.ZIP\"");

	String filename = "C:\\SomeDir\\notes.txt";
	createGetZip(response, rootPath, formname, fileNames);
}
%>
<%!
// метод создания '.zip' файла
public static void createGetZip(HttpServletResponse response, String rootPath, String formname, String[] fileNames) throws Exception {
	byte[] buf = new byte[2048];

    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    ZipOutputStream zout = new ZipOutputStream(baos);
    
    for (int i=0; i<fileNames.length; i++) {

        try {
            
            FileInputStream fis = new FileInputStream(rootPath + fileNames[i]);
            BufferedInputStream bis = new BufferedInputStream(fis);
        
            File file = new File(rootPath + fileNames[i]);
            String entryname = file.getName();
            zout.putNextEntry(new ZipEntry(entryname));
        
            int bytesRead;
            while ((bytesRead = bis.read(buf)) != -1) {
            zout.write(buf, 0, bytesRead);
            }
        
            zout.closeEntry();
            bis.close();
            fis.close();
               }
               catch (Exception ex) {
                   
            }
    }

    zout.flush();
    baos.flush();
    zout.close();
    baos.close();

    ServletOutputStream os = response.getOutputStream();
    String endcodeFormName = encodeValue(formname);
    response.setContentType("application/zip");
    response.setHeader("Content-Disposition", "attachment; filename=\""+ endcodeFormName +".zip\"");
    os.write(baos.toByteArray());
    System.out.println(baos.toByteArray());
    zout.flush();
    zout.close();
    os.flush();
    os.close();
}

    // парсим параметр 'Path' из 'config.xml'
    public static String getCognosDataPath(String applicationFolder) throws Exception {
		File inputFile = new File(applicationFolder + "\\config.xml");
		DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
		org.w3c.dom.Document doc = dBuilder.parse(inputFile);
		doc.getDocumentElement().normalize();
		String configPath = doc.getElementsByTagName("Path").item(0).getTextContent();
		return configPath;
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

    // метод получения пути к хранилищу Cognos
	public static String getRootPath(String serverName, String formname, String applicationFolder) throws Exception {
		StringBuffer rootPath = new StringBuffer(getCognosDataPath(applicationFolder));
		rootPath.append(serverName);
		rootPath.append("\\");
		return rootPath.toString();
	}
	
	private static String encodeValue(String value) throws Exception {
		String encodeMe = "файлы_формы_" + value;
		return URLEncoder.encode(encodeMe, StandardCharsets.UTF_8.toString());
}%>