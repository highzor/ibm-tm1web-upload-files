<%@ page import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="org.jsoup.Jsoup"%>
<%@ page import="com.google.gson.Gson"%>
<%@ page import="com.google.gson.stream.JsonReader"%>
<%@ page import="org.jsoup.nodes.Document"%>
<%@ page import="java.lang.System"%>
<%@ page import="org.jsoup.nodes.Element"%>
<%@ page import="org.jsoup.select.Elements"%>
<%@ page import="java.util.stream.Collectors"%>
<%@ page import="java.nio.file.Files"%>
<%@ page import="javax.xml.parsers.DocumentBuilderFactory"%>
<%@ page import="javax.xml.parsers.DocumentBuilder"%>
<%@ page import="java.nio.file.Path"%>
<%@ page import="java.nio.file.Paths"%>
<%@ page import="java.io.InputStream"%>
<%@ page import="java.io.*"%>
<%@ page import="java.net.URLEncoder"%>
<%@ page import="java.nio.charset.StandardCharsets"%>
<%@ page import="java.lang.StringBuilder"%>
<%@ page import="java.sql.*" %>
<%@ page import="java.util.Date" %>
<%@ page import="java.util.Scanner" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.List" %>

<%
// собираем данные из 'request'
request.setCharacterEncoding("UTF-8");
String serverName = request.getParameter("serverName");
String formname = request.getParameter("formname");
String user = request.getParameter("user");
String SQL2 = "SELECT * FROM TM1_LOGS.dbo.UserForm where USERS = ? and FORM = ?";
String url = "jdbc:sqlserver://10.40.1.6;user=sa;password=12345678";
String bodyRequest = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
// получаем путь до файла с конфигурацией
String applicationFolder = getApplicationFolder(application, request);



if (serverName != null && formname != null) {

	// парсим тело запроса (html таблица с комментариями)
	Document doc = Jsoup.parse(bodyRequest);
	ReplaceHelper replacedElement = new ReplaceHelper();
	Elements tdsWithFileName = doc.select("td[idx=0]");
	Elements tdsWithAuthorName = doc.select("td[idx=1]");
	Organizations[] organizationsAccess = getAdminAccess(applicationFolder);
	// обрабатываем каждую строчку таблицы комментариев
	for (int i = 0; i < tdsWithFileName.size(); i++) {
		
		Element tdWithFileName = tdsWithFileName.get(i);

		if (tdWithFileName.text().lastIndexOf("!-. . . .!") != -1) {

				String authorName = tdsWithAuthorName.get(i).text();
				DocumentDTO document = new DocumentDTO(serverName, user, authorName);
				String rootPath = getRootPath(document, serverName, tdWithFileName, formname, applicationFolder);

				replacedElement.getReplacedCell(document, tdWithFileName, serverName, rootPath, user, organizationsAccess);
		}
	}

	out.print(doc);
	out.flush();
}
%>

<%!public class ReplaceHelper {
		// метод получения переписанной строки таблицы html
		public void getReplacedCell(DocumentDTO document, Element td, String serverName, String rootPath, String user, Organizations[] organizationsAccess)
				throws Exception {

			boolean isExist = isFileExist(document, rootPath);
			if (isExist) {
				replaceDownloadAndDeleteCell(td, document, user, organizationsAccess);
			} else {
				replaceDeletedCell(td, document, rootPath);
			}
		}

	}

	// формируем объект 'DocumentDTO' из строки комментария для манипуляций
	public static DocumentDTO explodeCellValue(DocumentDTO document, String value, String formname) {
		String[] array = value.split(". . . . . . . . . . . . . . . .");
		String[] array2 = array[0].split("!-. . . .!");
		String[] array3 = array2[0].split("!. . . .!");
		String[] array4 = array3[0].split("Attachments:");
		if (array3[0].contains("!. . . .-!")) {
			String[] array5 = array3[0].split("!. . . .-!");
			document.Formname = array5[1].trim();
		}
		else 
		{
			document.Formname = formname;
		}

		document.FileNameAndSize = array2[1].trim();
		document.FileName = array3[1].trim();
		document.Message = array4[0].trim();
		

		return document;
	}

	// файл существует?
	public static boolean isFileExist(DocumentDTO document, String rootPath) throws Exception {
		StringBuffer filePath = new StringBuffer(rootPath);
		filePath.append(document.FileName);
		File file = new File(filePath.toString());
		if (file.exists() && !file.isDirectory()) {
			return true;
		}
		return false;
	}

	// метод формирования и возврат переписанных строк таблицы с ссылками на скачивание/удаление файла
	public static void replaceDownloadAndDeleteCell(Element td, DocumentDTO document, String user, Organizations[] organizationsAccess) throws Exception {

		boolean canDeleteCurrentFile = checkDeleteAble(document.AuthorName, user, organizationsAccess);
		StringBuffer urlDownload = new StringBuffer("/tm1web/upload/app/getfile.jsp?");
		StringBuffer urlRemove = new StringBuffer("/tm1web/upload/app/remove.jsp?");
		StringBuffer urlParameters = new StringBuffer();

		urlParameters.append("fileName=" + encodeValue(document.FileName));
		urlParameters.append("&");
		urlParameters.append("serverName=" + encodeValue(document.ServerName));
		urlParameters.append("&");
		urlParameters.append("formname=" + encodeValue(document.Formname));
		urlParameters.append("&");
		urlParameters.append("user=" + encodeValue(document.User));

		urlDownload.append(urlParameters);
		urlRemove.append(urlParameters);

		Element span = new Element("span");
		Element br = new Element("br");
		Element downloadLinkElement = new Element("a");

		downloadLinkElement.attr("id", "downloadButton");
		downloadLinkElement.attr("class", "FileDownload");
		downloadLinkElement.attr("href", urlDownload.toString());
		downloadLinkElement.attr("data-href", document.FileName);
		downloadLinkElement.attr("data-formname", document.Formname);
		downloadLinkElement.attr("target", "_blank");
		downloadLinkElement.text("Скачать ");

		span.attr("data-filename-log", document.FileName);
		span.appendChild(br);
		span.appendChild(downloadLinkElement);

		if (canDeleteCurrentFile == true) {

			Element removeLinkElement = new Element("a");

			removeLinkElement.attr("id", "removeButton");
			removeLinkElement.attr("data-href", document.FileName);
			removeLinkElement.attr("data-formname", document.Formname);
			removeLinkElement.attr("class", "FileRemove");
			removeLinkElement.attr("href", "javascript:;");
			removeLinkElement.attr("style", "color:red");
			removeLinkElement.attr("onClick", "removeFile($(this));");
			removeLinkElement.text("x Удалить");

			span.appendText(" (");
			span.appendChild(removeLinkElement);
			span.appendText(") ");
		}

		td.text(document.Message);
		td.appendChild(span);
		td.appendText(document.FileNameAndSize);
	}
	// метод получения строки таблицы комментариев, файлы которых удалены из хранилища
	public static void replaceDeletedCell(Element td, DocumentDTO document, String rootPath) throws Exception {

		User whoIsDeletedFile = searchRemovedFile(rootPath, document.FileName);

		Element span = new Element("span");
		Element spanWithInfo = new Element("span");
		Element br = new Element("br");

		spanWithInfo.attr("style", "cursor:pointer; border-bottom:1px dashed gray;");

		if (whoIsDeletedFile.name != null && whoIsDeletedFile.ErrorMessage == null) {
			spanWithInfo.attr("title", "Файл '" + whoIsDeletedFile.name + "' удален пользователем '"
					+ whoIsDeletedFile.user + "' в '" + whoIsDeletedFile.datetime + "'");
		} else {
			spanWithInfo.attr("title",
					"Файл '" + document.FileName + "' удален, дополнительная информация отсутствует");
		}
		spanWithInfo.appendText("Файл удален");

		span.attr("data-filename-log", document.FileName);
		span.appendChild(br);
		span.appendChild(spanWithInfo);

		td.text(document.Message);
		td.appendChild(span);
		td.appendText(" - " + document.FileNameAndSize);
	}

	// парсим параметр 'Path' из 'config.xml'
	public static String getCognosDataPath(String applicationFolder) throws Exception {
		
		File configFile = new File(applicationFolder + "\\config.xml");
		DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
		org.w3c.dom.Document doc = dBuilder.parse(configFile);
		doc.getDocumentElement().normalize();
		String configPath = doc.getElementsByTagName("Path").item(0).getTextContent();
		return configPath;
	}

	// может ли пользователь удалить файл
	public static boolean checkDeleteAble(String documentAuthor, String userName, Organizations[] organizationsAccess) throws Exception {
		
		if (documentAuthor.equals(userName)) {

			return true;
		}

		String organizationUser = "";
		String loginUser = "";
		
		if (userName.contains("/")) {

			String[] splittedUserData = userName.split("/");
			organizationUser = splittedUserData[0];
			loginUser = splittedUserData[1];
		}
		else if (userName.contains(":")) {

			String[] splittedUserData = userName.split(":");
			organizationUser = splittedUserData[0];
			loginUser = splittedUserData[1];
		}
		else {

			loginUser = userName;
		}

		for (Organizations organizationItem : organizationsAccess) {

			if (organizationItem.Organization.equals(organizationUser)) {

				for (Employee employee : organizationItem.Employees) {

					if (employee.Login.equals(loginUser) && employee.IsAdmin == true) {

						return true;
					}
				}
			}
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

	// метод получения пути к хранилищу Cognos
	public static String getRootPath(DocumentDTO document, String serverName, Element td, String formname, String applicationFolder) throws Exception {

		String cellValue = td.text();
		explodeCellValue(document, cellValue, formname);
		StringBuffer rootPath = new StringBuffer(getCognosDataPath(applicationFolder));
		rootPath.append(serverName);
		rootPath.append("\\");
		rootPath.append(document.Formname);
		rootPath.append("\\attachments\\");
		return rootPath.toString();
	}

	// метод получения компаний с работниками
	public static Organizations[] getAdminAccess(String applicationFolder) throws Exception {
		StringBuffer securityAccessFile = new StringBuffer(applicationFolder);
		securityAccessFile.append("\\access\\securityAccess.json");
		try {
			Gson gson = new Gson();
			JsonReader reader = new JsonReader(new FileReader(securityAccessFile.toString()));
			Organizations[] organizationsAccess = gson.fromJson(reader, Organizations[].class);
			return organizationsAccess;
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
	}

	// метод поиска удаленного файла
	public static User searchRemovedFile(String rootPath, String searchedFileName) throws Exception {
		User user = new User();
		StringBuffer logFile = new StringBuffer(rootPath);
		logFile.append("logs\\remove.txt");
		try {
			FileInputStream fis = new FileInputStream(logFile.toString());
			Scanner sc = new Scanner(fis);
			String line;
			while (sc.hasNextLine()) {
				line = sc.nextLine();
				if (line.contains(searchedFileName)) {
					String stringToParse = removeLastChar(line);
					Gson gson = new Gson();
					user = gson.fromJson(stringToParse, User.class);
					sc.close();
					return user;
				}
			}
			sc.close();
			return user;
		} catch (IOException e) {
			e.printStackTrace();
			user.ErrorMessage = e.getMessage();
			return user;
		}
	}

	public static class User {
		String user;
		String datetime;
		String name;
		String ErrorMessage;
	}

	public class DocumentDTO {
		String ServerName;
		String Formname;
		String FileName;
		String FileNameAndSize;
		String Message;
		String User;
		String AuthorName;

		public DocumentDTO(String serverName, String user, String authorName) {
			this.ServerName = serverName;
			this.User = user;
			this.AuthorName = authorName;
		}
	}

	public class Employee {
		public String Login;
		public boolean IsAdmin;
	}
	
	public static class Organizations {
		public String Organization;
		public ArrayList<Employee> Employees;
		public String ErrorMessage;
	}

	private static String encodeValue(String value) throws Exception {
		return URLEncoder.encode(value, StandardCharsets.UTF_8.toString());
	}

	public static String removeLastChar(String s) {
		return (s == null || s.length() == 0) ? null : (s.substring(0, s.length() - 1));
	}%>
