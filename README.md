# Color-Pro
Color Collection using Express + Vuejs + ElasticSearch


## Chức năng
1) Hiển thị tất cả Pallet, có phân trang, lọc
2) Copy mã màu
3) Người dùng đăng ký, đăng nhập, đăng nhập Facebook, google
4) Hiển thị Pallet liên quan theo màu.
5) Thêm Pallet
6) Chọn màu từ ảnh
7) Like, Dislike, share

## Sử dụng
1) Express
2) Express-vue
3) Elasticsearch
4) JWT

## Cài elasticsearch
1) Tải elasticsearch trong docker
```
docker pull elasticsearch:5.3.1-alpine
```

2) Container
```
docker run -d -p 9200:9200 --name elas elasticsearch:5.3.1-alpine -Ediscovery.zen.minimum_master_nodes=1
```

3) Vào trong container để cài X-Pack
```
docker exec -it elas /bin/sh
```

4) Vào được container "elas" rồi Chạy lệnh:
```
bin/elasticsearch-plugin install x-pack
```

5) Chạy xong thì có thể chạy được
```
http://localhost:9200/
username: elastic
password: changeme
```

## Cài đặt dữ liệu mẫu (init.js)
1) Chạy function createIndex để tạo DATABASE
```
createIndex();
```

2) Chạy function initData để thêm Pallet mẫu
```
initData();
```

3) Chạy function addAuthor để tạo user mặc định

```
addAuthor(author);
```

4) Chạy chương trình
```
node index.js
```



## Giao diện website
- Trang chủ
![Trang chu](public/img/index.png)

- Trang chi tiết
![Trang chi tiet](public/img/detail.png)


