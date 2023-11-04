import pandas as pd
import sys
import pickle  # load model đã train
import warnings

# Vô hiệu hóa tất cả các RuntimeWarning
warnings.filterwarnings("ignore", category=UserWarning)

c1 = sys.argv[1]
c2 = sys.argv[2]
c3 = sys.argv[3]
c4 = sys.argv[4]
c5 = sys.argv[5]
c6 = sys.argv[6]
c7 = sys.argv[7]
c8 = sys.argv[8]

df_test = pd.DataFrame({"c1": [int(c1)], "c2": [int(c2)], "c3": [int(c3)], "c4": [int(c4)], 
                        "c5": [int(c5)], "c6": [int(c6)], "c7": [int(c7)], "c8": [int(c8)]})

# print(df_test.head())
filename = 'lsvm.pkl'   
load_model = pickle.load(
    open("D:\\oldproject\\new\\BE-BOOKSTORE\\python\\"+filename, 'rb'))
predicts = load_model.predict(df_test)
print(predicts[0])
