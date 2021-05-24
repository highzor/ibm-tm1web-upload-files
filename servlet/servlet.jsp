<%@ page import="java.util.*" pageEncoding="UTF-8" %>
<%@ page import="org.jsoup.Jsoup" %>
<%@ page import="org.jsoup.nodes.Document" %>
<%@ page import="org.jsoup.nodes.Element" %>
<%@ page import="org.jsoup.select.Elements" %>
<%@ page import="java.util.stream.Collectors" %>
<%@ page import="java.nio.file.Files"%>
<%@ page import="javax.xml.parsers.DocumentBuilderFactory" %>
<%@ page import="javax.xml.parsers.DocumentBuilder" %>
<%@ page import="java.nio.file.Path"%>
<%@ page import="java.io.InputStream"%>
<%@ page import="java.io.*" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.nio.charset.StandardCharsets" %>
<%@ page import="java.lang.StringBuilder" %>

        <%
        request.setCharacterEncoding("UTF-8");
        String serverName = request.getParameter("serverName");
        String formname = request.getParameter("formname");
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
        			
        		    replacedElement.getReplacedCell(td, serverName, formname);
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
        
        <%!
        public class ReplaceHelper {
        	public String sayHello() {
        		return "helloFromClass";
        	}
        	//Step 1
        	public void getReplacedCell(Element td, String serverName, String formname) throws Exception {
        		DocumentDTO document = new DocumentDTO();
        		document.serverName = serverName;
        		document.formname = formname;
        		String cellValue = td.text();
        		explodeCellValue(document, cellValue);
        		boolean isExist = isFileExist(document);
        		if (isExist) {
        			replaceCell(td, document);
        		}
        	}
        	
        }
       
        public class DocumentDTO {
        	String serverName;
        	String formname;
        	String fileName;
        	String fileNameAndSize;
        	String Message;
        }
        
      //Step 2
        public static DocumentDTO explodeCellValue(DocumentDTO document, String value) {
    		String[] array = value.split(". . . . . . . . . . . . . . . .");
			String[] array2 = array[0].split("!-. . . .!");
			String[] array3 = array2[0].split("!. . . .!");
			String[] array4 = array3[0].split("Attachments:");
			document.fileNameAndSize = array2[1].trim();
			document.fileName = array3[1].trim();
			document.Message = array4[0].trim();
    		return document;
    	}
      
      //Step 3
        public static boolean isFileExist(DocumentDTO document) throws Exception {
        	File inputFile = new File("C:\\\\Program Files\\ibm\\cognos\\tm1web\\webapps\\tm1web\\upload\\config.xml");
            DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
            org.w3c.dom.Document doc = dBuilder.parse(inputFile);
            doc.getDocumentElement().normalize();
            String configPath = doc.getElementsByTagName("Path").item(0).getTextContent();
            String filePath = configPath + document.serverName + "\\" + document.formname + "\\attachments\\" + document.fileName;
            File file = new File(filePath);
            if(file.exists() && !file.isDirectory()) {
                return true;
            }
    		return false;
    	}
      
      //Step 4
        public static void replaceCell(Element td, DocumentDTO document) throws Exception {
        	StringBuffer url = new StringBuffer("/tm1web/upload/app/getfile.jsp?");
        	url.append("fileName=" + encodeValue(document.fileName));
        	url.append("&");
        	url.append("serverName=" + encodeValue(document.serverName));
        	url.append("&");
        	url.append("formname=" + encodeValue(document.formname));
    		Element span = new Element("span");
    		Element br = new Element("br");
    		Element a = new Element("a");
    		a.attr("id", "downloadButton");
    		a.attr("href", url.toString());
    		a.attr("target", "_blank");
    		a.text("Скачать");
    		span.attr("data-filename-log", document.fileName);
    		span.appendChild(br);
    		span.appendChild(a);
    		td.text(document.Message);
    		td.appendChild(span);
    	}
      
        private static String encodeValue(String value) throws Exception  {
            return URLEncoder.encode(value, StandardCharsets.UTF_8.toString());
        }
        
%>
