<%@ page import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="org.jsoup.Jsoup"%>
<%@page import="com.google.gson.Gson"%>
<%@ page import="org.jsoup.nodes.Document"%>
<%@ page import="org.jsoup.nodes.Element"%>
<%@ page import="org.jsoup.select.Elements"%>
<%@ page import="java.util.stream.Collectors"%>
<%@ page import="java.nio.file.Files"%>
<%@ page import="javax.xml.parsers.DocumentBuilderFactory"%>
<%@ page import="javax.xml.parsers.DocumentBuilder"%>
<%@ page import="java.nio.file.Path"%>
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
request.setCharacterEncoding("UTF-8");
String serverName = request.getParameter("serverName");
String formname = request.getParameter("formname");
String user = request.getParameter("user");
String SQL2 = "SELECT * FROM TM1_LOGS.dbo.UserForm where USERS = ? and FORM = ?";
String url = "jdbc:sqlserver://10.40.10.138;user=TestB;password=123456789";
String bodyRequest = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
Connection con = DriverManager.getConnection(url);
List<String> list = new ArrayList<String>();
ResultSet rs = null;
PreparedStatement preparedStatement = con.prepareStatement(SQL2);
preparedStatement.setString(1, user);
preparedStatement.setString(2, formname);
  rs = preparedStatement.executeQuery();
   while(rs.next())
            {
                String name = rs.getString("USERS");
                String id = rs.getString("FORM");
				   String STATMEN = rs.getString("STATMEN");
                list.add(name);
                list.add(id); list.add(STATMEN);
               // out.println(name+" "+id);
            }
			//out.println(list);
			con.close();


if (serverName != null && formname != null) {
	//Document doc = Jsoup.parse(subject);
	//out.print(doc);
	//out.println(serverName);
	//out.println(formname);
	//out.println(bodyRequest);
	Document doc = Jsoup.parse(bodyRequest);
	ReplaceHelper replacedElement = new ReplaceHelper();
	//String rootPath = getRootPath(serverName, formname);
	//out.println(doc);
	//Element table = doc.select("table[class=dojoxGridRowTable]").first();
	Elements tds = doc.select("td[idx=0]");
	for (Element td : tds) {
		if (td.text().lastIndexOf("!-. . . .!") != -1) {
	//out.println(element.text());
	//String rootPath = getRootPath(serverName, formname);
	DocumentDTO document = new DocumentDTO(serverName, user);
	String rootPath = getRootPath(document, serverName, td, formname);

	replacedElement.getReplacedCell(document, td, serverName, rootPath, user);
		}
		//el.text("hello " + i);
		//i++;
	}

	//out.println(td);
	out.print(doc);
	out.flush();
}
%>

<%!public class ReplaceHelper {
		//Step 1
		public void getReplacedCell(DocumentDTO document, Element td, String serverName, String rootPath, String user)
				throws Exception {

			//DocumentDTO document = new DocumentDTO(serverName, formname, user);
			//String cellValue = td.text();
			//explodeCellValue(document, cellValue);
			boolean isExist = isFileExist(document, rootPath);
			if (isExist) {
				replaceDownloadAndDeleteCell(td, document);
			} else {
				replaceDeletedCell(td, document, rootPath);
			}
		}

	}

	//Step 2
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

	//Step 3
	public static boolean isFileExist(DocumentDTO document, String rootPath) throws Exception {
		StringBuffer filePath = new StringBuffer(rootPath);
		filePath.append(document.FileName);
		File file = new File(filePath.toString());
		if (file.exists() && !file.isDirectory()) {
			return true;
		}
		return false;
	}

	//Step 4
	public static void replaceDownloadAndDeleteCell(Element td, DocumentDTO document) throws Exception {
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
		Element removeLinkElement = new Element("a");

		downloadLinkElement.attr("id", "downloadButton");
		downloadLinkElement.attr("href", urlDownload.toString());
		downloadLinkElement.attr("target", "_blank");
		downloadLinkElement.text("Скачать");

		removeLinkElement.attr("id", "removeButton");
		removeLinkElement.attr("data-href", document.FileName);
		removeLinkElement.attr("data-formname", document.Formname);
		removeLinkElement.attr("class", "FileRemove");
		//removeLinkElement.attr("target", "_blank");
		removeLinkElement.attr("href", "javascript:;");
		removeLinkElement.attr("style", "color:red");
		//removeLinkElement.attr("onClick", "return confirm('Вы подтверждаете удаление?');");
		removeLinkElement.attr("onClick", "removeFile($(this));");
		removeLinkElement.text("x Удалить");

		span.attr("data-filename-log", document.FileName);
		span.appendChild(br);
		span.appendChild(downloadLinkElement);
		span.appendText(" (");
		span.appendChild(removeLinkElement);
		span.appendText(") ");

		td.text(document.Message);
		td.appendChild(span);
		td.appendText(document.FileNameAndSize);
	}

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

	public static String getCognosDataPath() throws Exception {
		File inputFile = new File("C:\\\\Program Files\\ibm\\cognos\\tm1web\\webapps\\tm1web\\upload\\config.xml");
		DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
		org.w3c.dom.Document doc = dBuilder.parse(inputFile);
		doc.getDocumentElement().normalize();
		String configPath = doc.getElementsByTagName("Path").item(0).getTextContent();
		return configPath;
	}
	/*
	public static String getFilePath(DocumentDTO document) throws Exception {
		StringBuffer filePath = new StringBuffer(getCognosDataPath());
		filePath.append(document.ServerName);
		filePath.append("\\");
		filePath.append(document.Formname);
		filePath.append("\\attachments\\");
		return filePath.toString();
	}
	*/

	public static String getRootPath(DocumentDTO document, String serverName, Element td, String formname) throws Exception {

		String cellValue = td.text();
		explodeCellValue(document, cellValue, formname);
		StringBuffer rootPath = new StringBuffer(getCognosDataPath());
		rootPath.append(serverName);
		rootPath.append("\\");
		rootPath.append(document.Formname);
		rootPath.append("\\attachments\\");
		return rootPath.toString();
	}

	// public static String getRootPath(String serverName, String formname) throws Exception {
	// 	StringBuffer rootPath = new StringBuffer(getCognosDataPath());
	// 	rootPath.append(serverName);
	// 	rootPath.append("\\");
	// 	rootPath.append(formname);
	// 	rootPath.append("\\attachments\\");
	// 	return rootPath.toString();
	// }

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
		/*
		public User(String user, String datetime, String name) {
			this.user = user;
			this.datetime = datetime;
			this.name = name;
		}
		*/
	}

	public class DocumentDTO {
		String ServerName;
		String Formname;
		String FileName;
		String FileNameAndSize;
		String Message;
		String User;

		public DocumentDTO(String serverName, String user) {
			this.ServerName = serverName;
			this.User = user;
		}

		// public DocumentDTO(String serverName, String formname, String user) {
		// 	this.ServerName = serverName;
		// 	this.Formname = formname;
		// 	this.User = user;
		// }

	}

	private static String encodeValue(String value) throws Exception {
		return URLEncoder.encode(value, StandardCharsets.UTF_8.toString());
	}

	public static String removeLastChar(String s) {
		return (s == null || s.length() == 0) ? null : (s.substring(0, s.length() - 1));
	}%>
