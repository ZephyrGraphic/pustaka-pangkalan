import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/main.dart';

void main() {
  testWidgets('PerpustakaanApp smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const PerpustakaanApp());
  });
}
