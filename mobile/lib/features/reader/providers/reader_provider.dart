import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/api_constants.dart';
import '../../../core/network/api_client.dart';
import '../../../shared/models/reading_progress.dart';

class ReaderState {
  final int currentPage;
  final int totalPages;
  final bool isSyncing;
  final bool isBookmarked;
  final String? errorMessage;

  const ReaderState({
    this.currentPage = 1,
    this.totalPages = 1,
    this.isSyncing = false,
    this.isBookmarked = false,
    this.errorMessage,
  });

  ReaderState copyWith({
    int? currentPage,
    int? totalPages,
    bool? isSyncing,
    bool? isBookmarked,
    String? errorMessage,
  }) {
    return ReaderState(
      currentPage: currentPage ?? this.currentPage,
      totalPages: totalPages ?? this.totalPages,
      isSyncing: isSyncing ?? this.isSyncing,
      isBookmarked: isBookmarked ?? this.isBookmarked,
      errorMessage: errorMessage,
    );
  }
}

class ReaderNotifier extends StateNotifier<ReaderState> {
  final ApiClient _api = ApiClient();
  final String contentId;
  Timer? _debounceTimer;

  ReaderNotifier({required this.contentId, int initialPage = 1})
      : super(ReaderState(currentPage: initialPage)) {
    fetchInitialProgress();
  }

  Future<void> fetchInitialProgress() async {
    try {
      final response = await _api.dio.get(
        ApiConstants.readingProgress,
        queryParameters: {'contentId': contentId},
      );

      if (response.data['success'] == true && response.data['data'] != null) {
        final progress = ReadingProgressModel.fromJson(response.data['data']);
        state = state.copyWith(
          currentPage: progress.currentPage,
          totalPages: progress.totalPages,
        );
      }
    } catch (_) {}
  }

  void onPageChanged(int page, int total) {
    state = state.copyWith(currentPage: page, totalPages: total);

    // Debounce API sync call by 2 seconds
    _debounceTimer?.cancel();
    _debounceTimer = Timer(const Duration(seconds: 2), () {
      syncProgress(page, total);
    });
  }

  Future<void> syncProgress(int page, int total) async {
    state = state.copyWith(isSyncing: true);
    try {
      await _api.dio.post(
        ApiConstants.readingProgress,
        data: {
          'contentId': contentId,
          'currentPage': page,
          'totalPages': total,
        },
      );
      state = state.copyWith(isSyncing: false);
    } catch (_) {
      state = state.copyWith(isSyncing: false);
    }
  }

  Future<bool> toggleBookmark(int page, {String? note}) async {
    try {
      final response = await _api.dio.post(
        ApiConstants.bookmarks,
        data: {
          'contentId': contentId,
          'pageNumber': page,
          'note': note ?? 'Bookmark Halaman $page',
        },
      );

      if (response.data['success'] == true) {
        state = state.copyWith(isBookmarked: true);
        return true;
      }
      return false;
    } catch (_) {
      return false;
    }
  }

  @override
  void dispose() {
    _debounceTimer?.cancel();
    super.dispose();
  }
}

final readerProvider = StateNotifierProvider.family<ReaderNotifier, ReaderState, String>((ref, contentId) {
  return ReaderNotifier(contentId: contentId);
});
