SHOW DATABASES;
DROP DATABASE IF EXISTS Java_EE_POS;
CREATE DATABASE IF NOT EXISTS Java_EE_POS;
SHOW DATABASES;
USE Java_EE_POS;

DROP TABLE IF EXISTS Customer;
CREATE TABLE IF NOT EXISTS Customer(
    CustomerNIC VARCHAR(15),
    CustomerName VARCHAR(45) NOT NULL DEFAULT 'Unknown',
    CustomerAddress VARCHAR(45),
    CustomerContact VARCHAR(30),
    CONSTRAINT PRIMARY KEY (CustomerNIC)
    );
SHOW TABLES;
DESCRIBE Customer;
#==============================================================
DROP TABLE IF EXISTS Orders;
CREATE TABLE IF NOT EXISTS Orders(
    OrderID VARCHAR(15),
    OrderDate VARCHAR(15),
    CustomerName VARCHAR(15)NOT NULL DEFAULT 'Unknown',
    TotalPrice DOUBLE DEFAULT 0.00,
    Cash DOUBLE DEFAULT 0.00,
    Discount DOUBLE DEFAULT 0.00,
    CONSTRAINT PRIMARY KEY (OrderID),
    CONSTRAINT FOREIGN KEY (CustomerName) REFERENCES Customer (CustomerNIC) ON DELETE CASCADE ON UPDATE CASCADE
    );
SHOW TABLES;
DESCRIBE Orders;
#==============================================================
DROP TABLE IF EXISTS Item;
CREATE TABLE IF NOT EXISTS Item(
    ItemCode VARCHAR(15),
    ItemName VARCHAR(50),
    ItemPrice DOUBLE DEFAULT 0.00,
    Qty INT(5),
    CONSTRAINT PRIMARY KEY (ItemCode)
    );
SHOW TABLES;
DESCRIBE Item;
#==============================================================
DROP TABLE IF EXISTS OrderDetail;
CREATE TABLE IF NOT EXISTS OrderDetail(
    OrderID VARCHAR(15),
    ItemCode VARCHAR(15),
    UnitPrice DECIMAL(6,2),
    OrderQty INT(11),
    Discount DOUBLE(6,2),
    CONSTRAINT FOREIGN KEY (OrderID) REFERENCES Orders (OrderID) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FOREIGN KEY (ItemCode) REFERENCES Item (ItemCode));
SHOW TABLES;
DESCRIBE OrderDetail;