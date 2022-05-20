package Servlets;

import javax.annotation.Resource;
import javax.json.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@WebServlet(urlPatterns = "/orderDetails")
public class Order_Details_Servlet extends HttpServlet {
    @Resource(name="java:comp/env/jdbc/pool")
    DataSource ds;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            resp.setContentType("application/json");
            Connection connection = ds.getConnection();
            ResultSet rst=connection.prepareStatement("Select * from OrderDetail").executeQuery();
            JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();

            while (rst.next()){
                String OrderID = rst.getString(1);
                String ItemCode = rst.getString(2);
                String ItemName = rst.getString(3);
                String UnitPrice = rst.getString(4);
                String OrderQty = rst.getString(5);
                String TotalPrice = rst.getString(6);

                JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
                objectBuilder.add("OrderID",OrderID);
                objectBuilder.add("ItemCode",ItemCode);
                objectBuilder.add("ItemName",ItemName);
                objectBuilder.add("UnitPrice",UnitPrice);
                objectBuilder.add("OrderQty",OrderQty);
                objectBuilder.add("TotalPrice",TotalPrice);

                arrayBuilder.add(objectBuilder.build());
            }
            PrintWriter writer = resp.getWriter();
            JsonObjectBuilder response = Json.createObjectBuilder();
            response.add("status",200);
            response.add("message","Done");
            response.add("data",arrayBuilder.build());

            writer.print(response.build());
            connection.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        JsonReader reader = Json.createReader(req.getReader());
        JsonObject jsonObject = reader.readObject();

        String oID = jsonObject.getString("OrderID");
        String ItemCode = jsonObject.getString("ItemCode");
        String ItemName = jsonObject.getString("ItemName");
        String UnitPrice = jsonObject.getString("UnitPrice");
        String OrderQty = jsonObject.getString("OrderQty");
        String TotalPrice = jsonObject.getString("TotalPrice");

        double tempUnitPrice= Double.parseDouble(UnitPrice);
        int tempOrderQty= Integer.parseInt(OrderQty);
        double tempTotalPrice= Double.parseDouble(TotalPrice);

        System.out.println(tempUnitPrice+" & "+tempOrderQty+" & "+tempTotalPrice);

        resp.setContentType("application/json");
        PrintWriter writer = resp.getWriter();

        try {
            Connection con = ds.getConnection();
            String query="INSERT INTO OrderDetail VALUES(?,?,?,?,?,?)";

            PreparedStatement stm = con.prepareStatement(query);
            stm.setObject(1,oID);
            stm.setObject(2,ItemCode);
            stm.setObject(3,ItemName);
            stm.setObject(4,tempUnitPrice);
            stm.setObject(5,tempOrderQty);
            stm.setObject(6,tempTotalPrice);
            boolean b = stm.executeUpdate() > 0;
            if (b) {
                JsonObjectBuilder response = Json.createObjectBuilder();
                resp.setStatus(HttpServletResponse.SC_CREATED);//201
                response.add("status", 200);
                response.add("message", "Successfully Added");
                response.add("data", "");
                writer.print(response.build());
            }
            con.close();
        } catch (SQLException throwables) {
            JsonObjectBuilder response = Json.createObjectBuilder();
            response.add("status", 400);
            response.add("message", "Error");
            response.add("data", throwables.getLocalizedMessage());
            writer.print(response.build());
            resp.setStatus(HttpServletResponse.SC_OK); //200
            throwables.printStackTrace();
        }
    }

}
