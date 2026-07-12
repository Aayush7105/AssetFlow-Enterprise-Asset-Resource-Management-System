import 'package:flutter_test/flutter_test.dart';
import 'package:qr_scanner/main.dart';

void main() {
  testWidgets('App launches without crashing', (WidgetTester tester) async {
    await tester.pumpWidget(const AssetFlowApp());
    // Just verify the app builds without errors
    expect(find.byType(AssetFlowApp), findsOneWidget);
  });
}
