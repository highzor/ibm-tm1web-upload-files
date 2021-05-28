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

<%
request.setCharacterEncoding("UTF-8");
String serverName = request.getParameter("serverName");
String formname = request.getParameter("formname");
String user = request.getParameter("user");
String bodyRequest = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
if (serverName != null && formname != null) {
	//Document doc = Jsoup.parse(subject);
	//out.print(doc);
	//out.println(serverName);
	//out.println(formname);
	//out.println(bodyRequest);
	Document doc = Jsoup.parse(bodyRequest);
	ReplaceHelper replacedElement = new ReplaceHelper();
	//out.println(doc);
	//Element table = doc.select("table[class=dojoxGridRowTable]").first();
	Elements tds = doc.select("td[idx=0]");
	for (Element td : tds) {
		if (td.text().lastIndexOf("!-. . . .!") != -1) {
	//out.println(element.text());

	replacedElement.getReplacedCell(td, serverName, formname, user);
		}
		//el.text("hello " + i);
		//i++;
	}

	//out.println(td);
	out.print(doc);
}
// for(String person: people){
//    out.println("<li>" + person + "</li>");
//}
%>

<%!public class ReplaceHelper {
		//Step 1
		public void getReplacedCell(Element td, String serverName, String formname, String user) throws Exception {

			DocumentDTO document = new DocumentDTO(serverName, formname, user);
			String cellValue = td.text();
			explodeCellValue(document, cellValue);
			boolean isExist = isFileExist(document);
			if (isExist) {
				replaceDownloadAndDeleteCell(td, document);
			} else {
				replaceDeletedCell(td, document);
			}
		}

	}

	//Step 2
	public static DocumentDTO explodeCellValue(DocumentDTO document, String value) {
		String[] array = value.split(". . . . . . . . . . . . . . . .");
		String[] array2 = array[0].split("!-. . . .!");
		String[] array3 = array2[0].split("!. . . .!");
		String[] array4 = array3[0].split("Attachments:");

		document.FileNameAndSize = array2[1].trim();
		document.FileName = array3[1].trim();
		document.Message = array4[0].trim();

		return document;
	}

	//Step 3
	public static boolean isFileExist(DocumentDTO document) throws Exception {
		StringBuffer filePath = new StringBuffer(getFilePath(document));
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
		removeLinkElement.attr("href", urlRemove.toString());
		removeLinkElement.attr("target", "_blank");
		removeLinkElement.attr("style", "color:red");
		removeLinkElement.attr("onClick", "return confirm('Вы подтверждаете удаление?');");
		removeLinkElement.text("x Удалить");

		span.attr("data-filename-log", document.FileName);
		span.appendChild(br);
		span.appendChild(downloadLinkElement);
		span.appendText(" (");
		span.appendChild(removeLinkElement);
		span.appendText(") " + document.FileNameAndSize);

		td.text(document.Message);
		td.appendChild(span);
	}

	public static void replaceDeletedCell(Element td, DocumentDTO document) throws Exception {
		StringBuffer logFile = new StringBuffer(getFilePath(document));
		logFile.append("logs\\remove.txt");
		searchRemovedFile(logFile.toString(), document.FileName);
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
	
	public static String getFilePath(DocumentDTO document) throws Exception {
		StringBuffer filePath = new StringBuffer(getCognosDataPath());
		filePath.append(document.ServerName);
		filePath.append("\\");
		filePath.append(document.Formname);
		filePath.append("\\attachments\\");
		return filePath.toString();
	}
	
	public static String searchRemovedFile(String logFile, String searchedFileName) throws Exception {
		
		try {  
			FileInputStream fis = new FileInputStream(logFile);
			Scanner sc = new Scanner(fis);   
			while (sc.hasNextLine()) {
				System.out.println(sc.nextLine()); 
				if (sc.nextLine().contains(searchedFileName)) {
					String stringToParse = removeLastChar(sc.nextLine());
					Gson gson = new Gson();
                    User user = gson.fromJson(stringToParse, User.class);
					System.out.println(stringToParse);
					System.out.println(user.name);
					System.out.println(user.user);
					System.out.println(user.datetime);
					sc.close();
					return sc.nextLine();
				}
			}
			sc.close(); 
			return "";
		} catch (IOException e) {
			e.printStackTrace();
			return e.getMessage();
		}
	}
	
	public class User {
		String user;
		String datetime;
		String name;
		
		public User(String user, String datetime, String name) {
			this.user = user;
			this.datetime = datetime;
			this.name = name;
		}
	}

	public class DocumentDTO {
		String ServerName;
		String Formname;
		String FileName;
		String FileNameAndSize;
		String Message;
		String User;

		public DocumentDTO(String serverName, String formname, String user) {
			this.ServerName = serverName;
			this.Formname = formname;
			this.User = user;
		}
	}
	
	private static String encodeValue(String value) throws Exception {
		return URLEncoder.encode(value, StandardCharsets.UTF_8.toString());
	}
	
	public static String removeLastChar(String s) {
	    return (s == null || s.length() == 0) ? null : (s.substring(0, s.length() - 1));
	}
	%>
