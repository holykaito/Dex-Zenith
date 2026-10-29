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

- Pokédex: 1.558 loài/form, stats, Ability, Hidden Ability, Innate, tiến hóa, learnset.
- Moves: 1.051; Abilities: 530; Items: 1.064; TM/HM/TR: 233; Encounters: 15 bảng khu vực.
- Tìm kiếm, bộ lọc, sắp xếp, phân trang, liên kết giữa các mục.
- Chuyển Việt/Anh cho cả giao diện và mô tả. Bản dịch lấy từ các thư mục Text_vietnamese_core, Text_vietnamese_game; mô tả chưa được dịch sẽ giữ tiếng Anh.
- Ảnh Pokémon lấy từ repo công khai của game; PNG nhiều khung được chạy thành ảnh động; tự chuyển sang PNG nếu GIF không còn.

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
Cây tiến hóa hiển thị từng form thành một nút riêng, cùng sprite và điều kiện ngay trên đường nối. Mega có nhãn riêng.
Gộp TM/HM/Tutor trong pop-up. Danh sách TM/HM chỉ nhận Item có FieldUse TM/HM/TR; Z-Crystal vẫn nằm ở Items.
Tên Pocket đối chiếu Settings.bag_pocket_names và ZCRYSTAL_BAG_POCKET_NAME.
Ảnh Pokémon trên banner đổi ngẫu nhiên sau mỗi 5 giây khi trang đang được xem.
Không hiển thị thông tin nguồn hay liên kết dữ liệu trong giao diện.

Bản dịch đã khớp: 1.280/1.558 Pokémon/form, 1.040/1.045 Move, 512/522 Ability và 1.064/1.064 Item.
Các mô tả mới chưa có bản dịch khớp được giữ tiếng Anh. Không dùng bản dịch cũ khi hiệu ứng tiếng Anh đã thay đổi.

Để cập nhật website đã đăng: tải các nội dung trong ZIP lên đúng gốc repo hiện tại rồi Commit changes. Giữ Settings → Pages ở main → /docs.
Chỉ muốn thay phần web: upload nguyên thư mục docs ở gốc repo (gồm data/vi.json mới). Không xóa thư mục docs trước khi upload.
Nếu trang còn hiển thị bản cũ sau khi Pages hoàn tất: nhấn Ctrl+F5.

## Bản cập nhật v3

- Ability và Innate dùng cùng kiểu chữ; mỗi Ability một dòng, Hidden Ability có (H).
- Mức mở Innate riêng từng loài lấy từ AAM_Settings.rb và hiện trong ngoặc. Loài không có cấu hình riêng không thêm số.
- TM/HM/Tutor có số máy nếu có, màu nền theo hệ chiêu thức.
- Physical/Special/Status dùng nền đỏ/tím/xám.
- Loại 34 form Gigantamax khỏi Pokédex.
- Sprite sheet được chạy theo từng khung; dừng khi ngoài màn hình để giảm tải.
- Pokémon ngẫu nhiên trên banner mở được pop-up khi bấm.
- Wild Encounter không hiện số map trước tên khu vực.

Khi cập nhật game thủ công, thay cả AAM_Settings.rb nếu cấu hình mở Innate thay đổi.

## Bản cập nhật v4

- Pop-up chia hai bảng TM/HM (theo số máy, TM trước HM) và Tutor (theo alphabet tên Move). Chiêu có máy chỉ xuất hiện trong bảng TM/HM.
- Giữ tooltip, màu hệ và thông số chiêu thức trong cả hai bảng.
- Thanh stat đổi màu theo điểm: 1–29 đỏ, 30–59 cam, 60–89 vàng, 90–119 xanh lục nhạt, 120–149 xanh lục đậm, 150–179 xanh dương đậm, từ 180 tím đậm.

## Bản cập nhật v5

- Bỏ đường gạch dọc ở nhánh tiến hóa; giữ điều kiện và mũi tên riêng từng nhánh.
- Pop-up Move thêm tỉ lệ hiệu ứng phụ từ EffectChance trong PBS (mặc định 0% khi không khai báo).
- Pokémon học Move chia thành Học qua level và Học qua TM/HM/Tutor, có bộ tìm kiếm riêng. Egg Moves giữ ở mục riêng khi có dữ liệu.

## Bản cập nhật v6

Bỏ nền theo hệ ở hai bảng TM/HM và Tutor trong pop-up Pokémon; giữ nhãn hệ, category và tooltip.

## Bản cập nhật v7 — 25/10/2026

- Thêm dòng BST vào ngay bảng Base stats trong pop-up Pokémon.
- Mặc định 100 mục/trang; chọn 30, 50, 100 hoặc 200 ở cuối danh sách, lưu lựa chọn trên trình duyệt.
- Dấu ✓ cạnh tên trong Pokédex khi Flags chứa chính xác Done. Form dùng Flags sau khi kế thừa/ghi đè theo PBS.

Dữ liệu v7: 1.558 Pokémon/form, 1.051 Move, 530 Ability. 

## Bản cập nhật v8

Đồng bộ lại PBS, bản dịch, AAM Settings và danh sách sprite. Xác nhận 85 Pokémon/form có flag Done và hiện dấu ✓ cạnh tên trong Pokédex. Cập nhật mã phiên bản để trình duyệt tải dữ liệu mới.

## Bản cập nhật v9

- Lọc Move theo tag (Flags của Move trong PBS).
- Bấm tag trong pop-up Move để xem các chiêu cùng tag và Pokémon học được qua level/TM/HM/Tutor/Egg.
- Bấm tag trong pop-up Pokémon để xem các Pokémon có cùng Flags.
- Nhãn hệ nổi bật hơn category; trang Ability không hiện ID nội bộ.

Dữ liệu v9: 1558 Pokémon/form, 1064 Move, 539 Ability.

## Bản cập nhật v10

- Chữ nhãn hệ được chọn theo độ tương phản nền, kể cả trong tooltip Move.
- Item chỉ hiển thị tên, không hiện ID nội bộ ở danh sách và pop-up.
- Tag Move mở bảng chiêu chi tiết (hệ, category, power, accuracy, PP, priority, tỉ lệ hiệu ứng phụ và mô tả), không liệt kê Pokémon.
- Đồng bộ lại dữ liệu và các Pokémon/form có Flags Done.

Dữ liệu v10 xác nhận 98 Pokémon/form có flag Done. Độ tương phản chữ nhãn hệ tối thiểu 4,64:1 trên bảng màu hiện tại.

## Bản cập nhật v11

Nhãn hệ trong tooltip Move dùng chữ trắng trên nền hệ đậm hơn.
