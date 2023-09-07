import pymysql

# Kết nối đến cơ sở dữ liệu MySQL
conn = pymysql.connect(
    host='localhost',
    user='root',  # Thay 'your_username' bằng tên người dùng của MySQL
    password='15092001',  # Thay 'your_password' bằng mật khẩu của MySQL
    # Thay 'your_database_name' bằng tên của database trong MySQL
    database='bookstore'
)

# Tạo con trỏ cho kết nối
cursor = conn.cursor()

# Thực hiện truy vấn SELECT để lấy các cột user_id, item_id và rating từ bảng reviews
query = "SELECT id_user, id_item, rating FROM reviews"

# Thực thi truy vấn SELECT
cursor.execute(query)

# Lấy tất cả các dòng kết quả từ truy vấn
rows = cursor.fetchall()

# Đóng con trỏ và kết nối
cursor.close()
conn.close()

# Ghi dữ liệu vào file ex.dat
with open("ex.dat", "w") as file:
    for row in rows:
        line = " ".join(str(x) for x in row) + ".\n"
        file.write(line)
