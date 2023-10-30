import numpy as np
import pandas as pd

# Đọc dữ liệu: Đầu tiên đọc tệp CSV chứa dữ liệu từ đường dẫn đã cho và lưu vào 
# DataFrame pandas df. Sau đó, nó sẽ in ra 9 hàng đầu tiên của DataFrame.
df = pd.read_csv('D:\\oldproject\\New folder\\BE-BOOKSTORE\\python\\quiz.csv')
df.head(9)

# Chuẩn bị dữ liệu: Tách DataFrame thành hai mảng numpy x và y
# với x chứa tất cả các cột trừ cột cuối cùng và y chỉ chứa cột cuối cùng.  
x = df.iloc[:, :-1].values
y = df.iloc[:, -1].values

# Chia dữ liệu: Sau đó ta sẽ chia dữ liệu thành hai tập: tập huấn luyện và tập kiểm tra
# với tỷ lệ 80:20.
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(x,y, test_size=0.2, random_state=42)

print("Kích thước tập huấn luyện:", X_train.shape)
print("Kích thước tập kiểm tra:", X_test.shape)

# Huấn luyện mô hình SVM: Tiếp theo ta sẽ khởi tạo một mô hình SVM với kernel là “poly” và 
# gamma là “auto”, sau đó huấn luyện mô hình với tập huấn luyện.
# kernel="poly": Kernel là một hàm cho phép chúng ta ánh xạ dữ liệu từ không gian đầu vào
# sang một không gian đặc trưng cao hơn. 
# Trong trường hợp này, kernel “poly” ánh xạ dữ liệu của chúng ta lên không gian đa thức.
# gamma="auto": Gamma là tham số cho kernel RBF, Poly và Sigmoid. 
# Nếu gamma là ‘auto’ thì 1/n_features sẽ được sử dụng.
from sklearn.svm import SVC
lsvm = SVC(kernel="poly", gamma="auto")
lsvm.fit(X_train, y_train)

import pickle #lưu và đọc model đã train
from os import path
# Lưu và tải mô hình: Tiếp theo đó sẽ kiểm tra xem có file mô hình đã được lưu trước đó không. 
# Nếu không, nó sẽ lưu mô hình hiện tại vào file. Sau đó, nó sẽ tải mô hình từ file.
pkl_filename = "D:\\oldproject\\New folder\\BE-BOOKSTORE\\python\\lsvm.pkl"
if (not path.isfile(pkl_filename)):
    with open(pkl_filename, 'wb') as file:
        pickle.dump(lsvm, file)
        print("Đã lưu model")
    with open(pkl_filename, 'rb') as file:
        lsvm = pickle.load(file)
        print("Đã load model")
        
from sklearn import metrics
from sklearn.metrics import accuracy_score
# Kiểm tra mô hình: Cuối cùng, Ta sẽ sử dụng mô hình đã được huấn luyện để dự đoán 
# kết quả cho tập kiểm tra và sau đó tính toán tỷ lệ phân loại đúng.
y_pred=lsvm.predict(X_test)
ac=accuracy_score(y_test, y_pred)*100
print("Tỷ lệ phân loại đúng: ", ac)
