# Pokémon Zenith Dex — GitHub Pages

Website độc lập bằng HTML, CSS, JavaScript; không phụ thuộc ChatGPT Sites.

## Đăng website

1. Tạo một repository GitHub công khai, ví dụ zenith-dex.
2. Giải nén ZIP và tải toàn bộ nội dung lên repository. Giữ nguyên thư mục docs, pbs và các file Python.
3. Vào Settings → Pages.
4. Ở Build and deployment, chọn Source: Deploy from a branch.
5. Chọn branch main, thư mục /docs, rồi Save.
6. Đợi GitHub hoàn tất triển khai; lấy URL chính xác được hiển thị trong Settings → Pages.

Cũng có thể thêm bộ này vào repo game hiện tại, nhưng phải giữ các file website trong docs.
Không tải cả ZIP nguyên khối lên repo để triển khai: cần giải nén trước.

## Cập nhật PBS

Cách cập nhật từ file game trên máy:
1. Thay các file tương ứng trong pbs bằng bản mới. Đừng thêm thư mục backup.
2. Mở terminal tại thư mục chứa build_data.py.
3. Chạy: python build_data.py
4. Chạy: python verify_data.py
5. Đẩy cả hai file docs/data/zenith.json và docs/data/vi.json cùng các thay đổi cần thiết lên GitHub.

Cách lấy PBS mới nhất từ repo game:
- Chạy python update_repo.py
- Chạy python build_data.py
- Đẩy thay đổi lên GitHub.

Python chỉ dùng khi tạo/cập nhật dữ liệu, người chơi chỉ cần trình duyệt.
Không có máy chủ Python chạy thường trực. Không tự cập nhật định kỳ.
Cần Python 3.10+; chỉ dùng thư viện chuẩn, không cần cài pip.

## Xem thử trên máy

Chạy python -m http.server 8000 --directory docs
Mở http://localhost:8000. Không mở index.html trực tiếp bằng file://.

## Nội dung

- Pokédex: 1.593 loài/form, stats, Ability, Hidden Ability, Innate, tiến hóa, learnset.
- Moves: 1.045; Abilities: 522; Items: 1.064; TM/HM/TR: 233; Encounters: 15 bảng khu vực.
- Tìm kiếm, bộ lọc, sắp xếp, phân trang, liên kết giữa các mục.
- Chuyển Việt/Anh cho cả giao diện và mô tả. Bản dịch lấy từ các thư mục Text_vietnamese_core, Text_vietnamese_game; mô tả chưa được dịch sẽ giữ tiếng Anh.
- Ảnh Pokémon lấy từ repo công khai của game; PNG nhiều khung hiển thị khung đầu.

## Giới hạn dữ liệu

- Mô tả PBS không thay thế việc kiểm tra hiệu ứng Ruby. Không mô phỏng chiến đấu.
- Chưa có vị trí nhặt TM/Item hay Pokémon nhận qua event.
- ANTARTICBIRD được tham chiếu nhưng chưa có định nghĩa: giữ nguyên ID, không tự đoán.
- Form kế thừa thuộc tính bị bỏ trống từ loài cơ bản.
- Innate lấy từ innate_sets.txt theo ID; không tự suy đoán những loài chưa được khai báo.
- Stats PBS: HP/Atk/Def/Spe/SpA/SpD; hiển thị thành HP/Atk/Def/SpA/SpD/Spe.
- Tỷ lệ encounter tính từ trọng số trong cùng phương thức, không phải tỷ lệ gặp theo bước chân.
- Số # theo thứ tự loài cơ bản trong PBS; với Fakemon là chỉ mục của bộ tra cứu.
- TM compatibility lấy từ TutorMoves kết hợp trường Move của Item.
- Dữ liệu đọc file chính trước, phần mở rộng theo thứ tự tên; field sau ghi đè field trước khi trùng ID.

Dự án người hâm mộ, phi thương mại. Pokémon thuộc về các chủ sở hữu tương ứng.

## Bản cập nhật giao diện v2

Thanh điều hướng nằm ngang, tăng cỡ chữ, cột Innate và tooltip hiệu ứng cho Ability/Innate/Move.
Cây tiến hóa hiển thị đầy đủ gia đình, nhánh và các form cùng sprite; các form xếp chung loài, không coi Mega là tiến hóa thường.
Gộp TM/HM/Tutor trong pop-up. Danh sách TM/HM chỉ nhận Item có FieldUse TM/HM/TR; Z-Crystal vẫn nằm ở Items.
Tên Pocket đối chiếu Settings.bag_pocket_names và ZCRYSTAL_BAG_POCKET_NAME.
Ảnh Pokémon trên banner đổi ngẫu nhiên sau mỗi 5 giây khi trang đang được xem.
Không hiển thị thông tin nguồn hay liên kết dữ liệu trong giao diện.

Bản dịch đã khớp: 1.281/1.593 Pokémon/form, 1.040/1.045 Move, 512/522 Ability và 1.064/1.064 Item.
Các mô tả mới chưa có bản dịch khớp được giữ tiếng Anh. Không dùng bản dịch cũ khi hiệu ứng tiếng Anh đã thay đổi.

Để cập nhật website đã đăng: tải các nội dung trong ZIP lên đúng gốc repo hiện tại rồi Commit changes. Giữ Settings → Pages ở main → /docs.
Chỉ muốn thay phần web: upload nguyên thư mục docs ở gốc repo (gồm data/vi.json mới). Không xóa thư mục docs trước khi upload.
Nếu trang còn hiển thị bản cũ sau khi Pages hoàn tất: nhấn Ctrl+F5.
