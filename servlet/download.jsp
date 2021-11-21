<%@ page import="java.nio.file.Files" %>
<%@ page import="java.nio.file.Paths" %>
<%@ page import="java.io.File" %>
<%@ page import="java.nio.file.StandardCopyOption" %>
<%@ page import="java.util.Date" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%	
    String applicationFolder = getApplicationFolder(application, request);
	File inputFile = new File(applicationFolder + "\\config.xml");
    DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
    DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
    Document doc = dBuilder.parse(inputFile);
    doc.getDocumentElement().normalize();
    String configPath = doc.getElementsByTagName("Path").item(0).getTextContent();
    String TM1ModelsPath = doc.getElementsByTagName("TM1Models").item(0).getTextContent();
    String RepositoryPath = doc.getElementsByTagName("Repository").item(0).getTextContent();

	String filename = request.getParameter("fileName");
	String formname = request.getParameter("formname");
    //String filepath = "C:\\\\TM1Models\\" + request.getParameter("serverName")+ "\\"+request.getParameter("formname")+ "\\attachments\\";
    String filepath = TM1ModelsPath + request.getParameter("serverName")+ "\\"+request.getParameter("formname")+ "\\attachments\\";
    String newFolder = RepositoryPath + request.getParameter("serverName") +"\\"+request.getParameter("formname")+ "\\";
    String newFolderLogs = RepositoryPath + request.getParameter("serverName") +"\\"+request.getParameter("formname")+ "\\logs\\";
	Files.createDirectories(Paths.get(newFolder));
	Files.createDirectories(Paths.get(newFolderLogs));
	
	Date currDate = new Date();
    File[] files = new File(newFolder).listFiles();
    for (File file : files) {
        if((currDate.getTime() - file.lastModified()) > 1)
        file.delete();
    }
    
    Files.copy(Paths.get(filepath + filename), Paths.get(newFolder + filename), StandardCopyOption.REPLACE_EXISTING);
%>
<%! 
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