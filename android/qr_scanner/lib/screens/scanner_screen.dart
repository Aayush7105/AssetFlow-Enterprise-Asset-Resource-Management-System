import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:qr_scanner/core/constants.dart';
import 'package:qr_scanner/models/asset.dart';
import 'package:qr_scanner/services/api_service.dart';

class ScannerScreen extends StatefulWidget {
  const ScannerScreen({super.key});

  @override
  State<ScannerScreen> createState() => _ScannerScreenState();
}

class _ScannerScreenState extends State<ScannerScreen> {
  final MobileScannerController _controller = MobileScannerController(
    detectionSpeed: DetectionSpeed.normal,
    facing: CameraFacing.back,
  );
  bool _isProcessing = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _onDetect(BarcodeCapture capture) async {
    if (_isProcessing) return;
    final barcodes = capture.barcodes;
    if (barcodes.isEmpty) return;

    final code = barcodes.first.rawValue;
    if (code == null || code.isEmpty) return;

    setState(() => _isProcessing = true);

    try {
      final response = await ApiService.instance.get('/assets/$code');

      if (!mounted) return;

      if (response['success'] == true) {
        final asset = Asset.fromJson(response['data']);
        await Navigator.of(context).pushNamed(
          AppConstants.assetDetailRoute,
          arguments: asset,
        );
        // Allow scanning again when returning
        setState(() => _isProcessing = false);
      } else {
        _showError(response['message'] ?? 'Asset not found');
        setState(() => _isProcessing = false);
      }
    } catch (e) {
      if (!mounted) return;
      _showError('Failed to fetch asset details');
      setState(() => _isProcessing = false);
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red.shade700,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
        duration: const Duration(seconds: 3),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // Camera feed
          MobileScanner(
            controller: _controller,
            onDetect: _onDetect,
          ),

          // Overlay with viewfinder
          _buildOverlay(theme),

          // Top bar
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: SafeArea(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 8,
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    _circleButton(
                      icon: Icons.arrow_back_rounded,
                      onTap: () => Navigator.of(context).pop(),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.5),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Text(
                        'Scan QR Code',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w600,
                          fontSize: 14,
                        ),
                      ),
                    ),
                    _circleButton(
                      icon: Icons.flash_on_rounded,
                      onTap: () => _controller.toggleTorch(),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Loading indicator
          if (_isProcessing)
            Center(
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: 0.7),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    CircularProgressIndicator(
                      color: Colors.white,
                      strokeWidth: 2.5,
                    ),
                    SizedBox(height: 16),
                    Text(
                      'Fetching asset...',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _circleButton({
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 42,
        height: 42,
        decoration: BoxDecoration(
          color: Colors.black.withValues(alpha: 0.5),
          shape: BoxShape.circle,
        ),
        child: Icon(icon, color: Colors.white, size: 22),
      ),
    );
  }

  Widget _buildOverlay(ThemeData theme) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final scanSize = constraints.maxWidth * 0.65;
        final left = (constraints.maxWidth - scanSize) / 2;
        final top = (constraints.maxHeight - scanSize) / 2;

        return Stack(
          children: [
            // Dim surrounding area
            ColorFiltered(
              colorFilter: ColorFilter.mode(
                Colors.black.withValues(alpha: 0.55),
                BlendMode.srcOut,
              ),
              child: Stack(
                children: [
                  Container(
                    decoration: const BoxDecoration(
                      color: Colors.white,
                      backgroundBlendMode: BlendMode.dstOut,
                    ),
                  ),
                  Positioned(
                    left: left,
                    top: top,
                    child: Container(
                      width: scanSize,
                      height: scanSize,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(24),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Corner decorations
            Positioned(
              left: left - 2,
              top: top - 2,
              child: _corner(theme, topLeft: true),
            ),
            Positioned(
              right: left - 2,
              top: top - 2,
              child: _corner(theme, topRight: true),
            ),
            Positioned(
              left: left - 2,
              bottom: (constraints.maxHeight - top - scanSize) - 2,
              child: _corner(theme, bottomLeft: true),
            ),
            Positioned(
              right: left - 2,
              bottom: (constraints.maxHeight - top - scanSize) - 2,
              child: _corner(theme, bottomRight: true),
            ),

            // Bottom instruction
            Positioned(
              bottom: (constraints.maxHeight - top - scanSize) / 2 - 20,
              left: 0,
              right: 0,
              child: Text(
                'Align QR code within the frame',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.white.withValues(alpha: 0.7),
                  fontSize: 14,
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _corner(
    ThemeData theme, {
    bool topLeft = false,
    bool topRight = false,
    bool bottomLeft = false,
    bool bottomRight = false,
  }) {
    return SizedBox(
      width: 32,
      height: 32,
      child: CustomPaint(
        painter: _CornerPainter(
          color: theme.colorScheme.primary,
          topLeft: topLeft,
          topRight: topRight,
          bottomLeft: bottomLeft,
          bottomRight: bottomRight,
        ),
      ),
    );
  }
}

class _CornerPainter extends CustomPainter {
  final Color color;
  final bool topLeft;
  final bool topRight;
  final bool bottomLeft;
  final bool bottomRight;

  _CornerPainter({
    required this.color,
    this.topLeft = false,
    this.topRight = false,
    this.bottomLeft = false,
    this.bottomRight = false,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 4
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final path = Path();

    if (topLeft) {
      path.moveTo(0, size.height * 0.6);
      path.lineTo(0, 6);
      path.quadraticBezierTo(0, 0, 6, 0);
      path.lineTo(size.width * 0.6, 0);
    } else if (topRight) {
      path.moveTo(size.width * 0.4, 0);
      path.lineTo(size.width - 6, 0);
      path.quadraticBezierTo(size.width, 0, size.width, 6);
      path.lineTo(size.width, size.height * 0.6);
    } else if (bottomLeft) {
      path.moveTo(0, size.height * 0.4);
      path.lineTo(0, size.height - 6);
      path.quadraticBezierTo(0, size.height, 6, size.height);
      path.lineTo(size.width * 0.6, size.height);
    } else if (bottomRight) {
      path.moveTo(size.width * 0.4, size.height);
      path.lineTo(size.width - 6, size.height);
      path.quadraticBezierTo(
        size.width, size.height, size.width, size.height - 6,
      );
      path.lineTo(size.width, size.height * 0.4);
    }

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
