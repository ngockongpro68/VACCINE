# Vaccine Check

Website MVP tra cứu vaccine theo quốc gia, tuổi, lịch sử tiêm, tình trạng hiện tại và tình huống đổi sản phẩm vaccine.

## Chức năng chính

- Chọn country schedule riêng cho Việt Nam, Hoa Kỳ, Vương quốc Anh, Úc.
- Nhập ngày sinh, ngày kiểm tra và lịch sử đã tiêm.
- Phân nhóm kết quả: đến lịch, tiêm bù, sắp tới, chưa đủ điều kiện, cần bác sĩ đánh giá.
- Rule engine mẫu theo tuổi tối thiểu, khoảng cách tối thiểu, giới hạn tuổi và tình trạng sức khỏe.
- Vaccine equivalence checker dựa trên thành phần kháng nguyên, ví dụ 6 trong 1 đổi sang 6 trong 1 khác, hoặc 6 trong 1 đổi sang Pentaxim.
- Tab nguồn dữ liệu với ngày hiệu lực và ngày website rà soát.

## Chạy local

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

## Kiểm tra

```bash
npm run lint
npm run build
```

## Lưu ý y khoa

Đây là MVP tham khảo, chưa phải clinical rule engine hoàn chỉnh. Trước khi dùng thật cần bác sĩ hoặc đơn vị chuyên môn duyệt từng country profile, rule catch-up, rule đổi vaccine và nội dung cảnh báo.
