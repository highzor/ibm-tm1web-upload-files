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

<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>First JSP App</title>
    </head>
    <body>
        <h3></h3>
        <%
        request.setCharacterEncoding("UTF-8");
        String serverName = request.getParameter("serverName");
        String formname = request.getParameter("formname");
        String bodyRequest = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
        if (serverName != null && formname != null) {
        	//Document doc = Jsoup.parse(subject);
        	//out.print(doc);
        	out.println(serverName);
            out.println(formname);
        	//out.println(bodyRequest);
        	Document doc = Jsoup.parse(bodyRequest);
        	ReplaceHelper replacedElement = new ReplaceHelper();
        	//out.println(doc);
        	//Element table = doc.select("table[class=dojoxGridRowTable]").first();
        	Elements td = doc.select("td[idx=0]");
        	for (Element element : td) {
        		if (element.text().lastIndexOf("!-. . . .!") != -1) {
        			//out.println(element.text());
        			
        			replacedElement.replaceCell(element, serverName, formname);
        		}
        		//el.text("hello " + i);
        		//i++;
        	}
        	
        	//out.println(td);
        	//out.print(doc);
        }
        String tst = "";
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
        	public void replaceCell(Element elem, String serverName, String formname) throws Exception {
        		DocumentDTO document = new DocumentDTO();
        		String cellValue = elem.text();
        		explodeCellValue(document, cellValue);
        		isFileExist(document, serverName, formname);
        	}
        	
        }
        
        
        public class DocumentDTO {
        	String fileName;
        	String fileNameAndSize;
        	String Message;
        	String linkToFile;
        	
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
      
        public static boolean isFileExist(DocumentDTO document, String serverName, String formname) throws Exception {
        	File inputFile = new File("C:\\\\Program Files\\ibm\\cognos\\tm1web\\webapps\\tm1web\\upload\\config.xml");
            DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
            org.w3c.dom.Document doc = dBuilder.parse(inputFile);
            doc.getDocumentElement().normalize();
            String configPath = doc.getElementsByTagName("Path").item(0).getTextContent();
            String filepath = configPath + serverName + "\\" + formname + "\\attachments\\" + document.fileName;
            File f = new File(filepath);
            if(f.exists() && !f.isDirectory()) { 
                return true;
            }
    		return false;
    	}
        
%>
    </body>
</html>