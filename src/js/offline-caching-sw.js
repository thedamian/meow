"use strict";

/* A version number is useful when updating the worker logic,
   allowing you to remove outdated cache entries during the update.
*/
var version = 'v1::';

/* These resources will be downloaded and cached by the service worker
   during the installation process. If any resource fails to be downloaded,
   then the service worker won't be installed either.
*/
var offlineFundamentals = [
  '',
  '/',
];

var offlinePage = '<html><head><title>Uh oh, you appear to be offline!</title><style>html{background:#E7EEF4;}.offline{box-sizing:border-box;display:flex;align-items:center;justify-content:center;min-height:100%;padding:2rem;}.offline__container{box-sizing:border-box;width:auto;text-align:center;}h2{font-family:Helvetica,Arial,sans-serif;}</style></head><body><section class="offline"><div class="offline__container"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIyMDlweCIgaGVpZ2h0PSIyMDlweCIgdmlld0JveD0iMCAwIDIwOSAyMDkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+ICAgICAgICA8dGl0bGU+ZmF2aWNvbi1yb2JvdDwvdGl0bGU+ICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPiAgICA8ZGVmcz4gICAgICAgIDxwYXRoIGQ9Ik0wLjY4MDg4ODY3NSw4LjYyMDM1NjU2IEMwLjY4MDg4ODY3MywyLjk2MzY0MjEyIDEuMjI0NjE3MjQsNC4wOTEzMzQwNiAxLjIyNDYxNzI0LDQuMDkxMzM0MDYgQzIuMjA1MTM0MDYsMS44MzE3NTI2NSA1LjAxNDE0MDQsMCA3LjQ5ODIzNjMxLDAgTDU0LjYyODgzMzEsMCBDNTcuMTEzMTQwNCwwIDU5LjEyNzA2OTQsMi4wMTg0MTIyOSA1OS4xMjcwNjk0LDQuNDk3OTc1MDIgTDU5LjEyNzA2OTQsMTEuOTYyNzg1IEM1OS4xMjcwNjk0LDE0LjQ0Njk0OCA1Ny4xMTI5MjksMTYuNDYwNzYgNTQuNjI4ODMzMSwxNi40NjA3NiBMNy40OTgyMzYzMSwxNi40NjA3NiBDNS4wMTM5Mjg5OSwxNi40NjA3NiAxLjg5NDc4MDgyLDE0Ljc3NzIyOTQgMS4wOTAxNjA4NCwxMi40Mzk5MTEzIEMxLjA5MDE2MDg0LDEyLjQzOTkxMTMgMC42ODA4ODg2NzcsMTQuMjc3MDcxIDAuNjgwODg4Njc1LDguNjIwMzU2NTYgWiIgaWQ9InBhdGgtMSI+PC9wYXRoPiAgICAgICAgPG1hc2sgaWQ9Im1hc2stMiIgbWFza0NvbnRlbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIG1hc2tVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIHg9IjAiIHk9IjAiIHdpZHRoPSI1OC40NDYxODA3IiBoZWlnaHQ9IjE2LjQ2MDc2IiBmaWxsPSJ3aGl0ZSI+ICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4gICAgICAgIDwvbWFzaz4gICAgICAgIDxyZWN0IGlkPSJwYXRoLTMiIHg9IjMiIHk9IjI2IiB3aWR0aD0iOSIgaGVpZ2h0PSIxOSIgcng9IjEiPjwvcmVjdD4gICAgICAgIDxtYXNrIGlkPSJtYXNrLTQiIG1hc2tDb250ZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBtYXNrVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94IiB4PSIwIiB5PSIwIiB3aWR0aD0iOSIgaGVpZ2h0PSIxOSIgZmlsbD0id2hpdGUiPiAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI3BhdGgtMyI+PC91c2U+ICAgICAgICA8L21hc2s+ICAgICAgICA8cmVjdCBpZD0icGF0aC01IiB4PSI0IiB5PSIxNCIgd2lkdGg9IjciIGhlaWdodD0iMTQiIHJ4PSIxIj48L3JlY3Q+ICAgICAgICA8bWFzayBpZD0ibWFzay02IiBtYXNrQ29udGVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgbWFza1VuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgeD0iMCIgeT0iMCIgd2lkdGg9IjciIGhlaWdodD0iMTQiIGZpbGw9IndoaXRlIj4gICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9IiNwYXRoLTUiPjwvdXNlPiAgICAgICAgPC9tYXNrPiAgICAgICAgPHJlY3QgaWQ9InBhdGgtNyIgeD0iMCIgeT0iMyIgd2lkdGg9IjM5IiBoZWlnaHQ9IjI3IiByeD0iMyI+PC9yZWN0PiAgICAgICAgPG1hc2sgaWQ9Im1hc2stOCIgbWFza0NvbnRlbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIG1hc2tVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIHg9IjAiIHk9IjAiIHdpZHRoPSIzOSIgaGVpZ2h0PSIyNyIgZmlsbD0id2hpdGUiPiAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI3BhdGgtNyI+PC91c2U+ICAgICAgICA8L21hc2s+ICAgIDwvZGVmcz4gICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+ICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlLTIiIGZpbGw9IiNFN0VGRjUiIHg9Ii0xODk1IiB5PSItMzg3IiB3aWR0aD0iMjgwMyIgaGVpZ2h0PSI4MzgiPjwvcmVjdD4gICAgICAgIDxnIGlkPSJQb2VzLVJvYm90IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjAwMDAwMCwgNy4wMDAwMDApIj4gICAgICAgICAgICA8ZyBpZD0iQ2F0Ij4gICAgICAgICAgICAgICAgPGcgaWQ9IkJvZHkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDM1LjAwMDAwMCwgMzQuMDAwMDAwKSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2U9IiMyNDE4MDgiIGZpbGw9IiNBRkFGQUYiPiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTEwOC42NzQxNzksMzMuMzA5MDkzNSBDMTEyLjUyNDQyMSwzOC40MzQzMjc1IDExNS40ODU5NjIsNDQuMjAyODgxNiAxMTcuMTc2NTU0LDUwLjM2NzY0MDcgQzEyMi44NzgzNzQsNzEuMTU5Mzg4NyAxMzAuNjYwMTU2LDE5Ni4zNzUgMTMwLjY2MDE1NiwxOTYuMzc1IEwwLjI5MjI3MjIyNSwxOTYuMzc0OTk5IEMwLjI5MjI3MjIyNSwxOTYuMzc0OTk5IC0wLjM2MzEwMDg1NywxMDguNTEyMDg2IDEzLjA5MjUzNjgsNTQuODYwMTM2NCBDMTUuMDQxMzA2NCw0Ny4wODk3NjU4IDE3LjY2MjkzOTcsNDAuNDc3NzM1NyAyMC44NDQwMDYyLDM0LjkxOTk0MzUgTDE5LjYwNTIzMTUsMzUuOTY2MzY2NyBMMjQuNjMyNjIxMSw0LjUzNTk5MzMyIEMyNC42MzI2MjExLDQuNTM1OTkzMzIgMjYuMzg4OTM2OCwtMS42NTU3NjI3NyAzMi4yNjkzNjgzLDAuNzQxODA2MjUgQzM3LjIzNDUzNjgsMi43NjYyMDQyOSA0Mi43NzA5NDg3LDExLjI5MjY5ODcgNDQuMzc0MTAwOCwxMy44OTc4Nzg2IEM1Mi41ODYzMzgsMTAuNjkyMjcwMiA2MS43NjA4OTg4LDkuODg3MTAzMyA3MS4zNjQ3NTM3LDEwLjk5MzE4MTIgQzc1LjQzODgzMDIsMTEuNDYyMzkzNSA3OS41MjE1NjYzLDEyLjUxNDg1MTYgODMuNDg4MDkyNiwxNC4wNjk4MzA3IEw5NS4wNDY0ODE4LDIuOTc0NDEwNjEgQzk1LjA0NjQ4MTgsMi45NzQ0MTA2MSAxMDEuNjc5Nzk3LC0xLjQ1ODU0OTY4IDEwMy42MTM0ODEsNS4xODA5Njc5MSBDMTA1LjU0NzE2NCwxMS44MjA0ODU1IDEwOS44MDI3NTcsMzQuMTU1MjA5OSAxMDkuODAyNzU3LDM0LjE1NTIwOTkgTDEwOC42NzQxNzksMzMuMzA5MDkzNSBaIj48L3BhdGg+ICAgICAgICAgICAgICAgIDwvZz4gICAgICAgICAgICAgICAgPGcgaWQ9IkZhY2UiPiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9IlJpdmV0cyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDAuMDAwMDAwLCA0Ny4wMDAwMDApIiBmaWxsPSIjNjU2NTY1Ij4gICAgICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsLTkiIGN4PSIxLjUiIGN5PSIxMTQuNSIgcj0iMS41Ij48L2NpcmNsZT4gICAgICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsLTkiIGN4PSIzLjUiIGN5PSI5NS41IiByPSIxLjUiPjwvY2lyY2xlPiAgICAgICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwtOSIgY3g9IjQuNSIgY3k9Ijg2LjUiIHI9IjEuNSI+PC9jaXJjbGU+ICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC05IiBjeD0iNS41IiBjeT0iNzcuNSIgcj0iMS41Ij48L2NpcmNsZT4gICAgICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsLTkiIGN4PSI2LjUiIGN5PSI3MC41IiByPSIxLjUiPjwvY2lyY2xlPiAgICAgICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwtOSIgY3g9IjE1LjUiIGN5PSIyOS41IiByPSIxLjUiPjwvY2lyY2xlPiAgICAgICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwtOSIgY3g9IjIwLjUiIGN5PSIyMi41IiByPSIxLjUiPjwvY2lyY2xlPiAgICAgICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwtOSIgY3g9IjI1LjUiIGN5PSIxNi41IiByPSIxLjUiPjwvY2lyY2xlPiAgICAgICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwtOSIgY3g9IjMwLjUiIGN5PSIxMS41IiByPSIxLjUiPjwvY2lyY2xlPiAgICAgICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwtOSIgY3g9IjM3LjUiIGN5PSI2LjUiIHI9IjEuNSI+PC9jaXJjbGU+ICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTQ2LjUsNCBDNDcuMzI4NDI3MSw0IDQ4LDMuMzI4NDI3MTIgNDgsMi41IEM0OCwxLjY3MTU3Mjg4IDQ3LjMyODQyNzEsMSA0Ni41LDEgQzQ1LjY3MTU3MjksMSA0NSwxLjY3MTU3Mjg4IDQ1LDIuNSBDNDUsMy4zMjg0MjcxMiA0NS42NzE1NzI5LDQgNDYuNSw0IFoiIGlkPSJPdmFsLTkiPjwvcGF0aD4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNTguNSwzIEM1OS4zMjg0MjcxLDMgNjAsMi4zMjg0MjcxMiA2MCwxLjUgQzYwLDAuNjcxNTcyODc1IDU5LjMyODQyNzEsMCA1OC41LDAgQzU3LjY3MTU3MjksMCA1NywwLjY3MTU3Mjg3NSA1NywxLjUgQzU3LDIuMzI4NDI3MTIgNTcuNjcxNTcyOSwzIDU4LjUsMyBaIiBpZD0iT3ZhbC05Ij48L3BhdGg+ICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTcwLjUsNCBDNzEuMzI4NDI3MSw0IDcyLDMuMzI4NDI3MTIgNzIsMi41IEM3MiwxLjY3MTU3Mjg4IDcxLjMyODQyNzEsMSA3MC41LDEgQzY5LjY3MTU3MjksMSA2OSwxLjY3MTU3Mjg4IDY5LDIuNSBDNjksMy4zMjg0MjcxMiA2OS42NzE1NzI5LDQgNzAuNSw0IFoiIGlkPSJPdmFsLTkiPjwvcGF0aD4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNODEuNSw4IEM4Mi4zMjg0MjcxLDggODMsNy4zMjg0MjcxMiA4Myw2LjUgQzgzLDUuNjcxNTcyODggODIuMzI4NDI3MSw1IDgxLjUsNSBDODAuNjcxNTcyOSw1IDgwLDUuNjcxNTcyODggODAsNi41IEM4MCw3LjMyODQyNzEyIDgwLjY3MTU3MjksOCA4MS41LDggWiIgaWQ9Ik92YWwtOSI+PC9wYXRoPiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik05MC41LDEzIEM5MS4zMjg0MjcxLDEzIDkyLDEyLjMyODQyNzEgOTIsMTEuNSBDOTIsMTAuNjcxNTcyOSA5MS4zMjg0MjcxLDEwIDkwLjUsMTAgQzg5LjY3MTU3MjksMTAgODksMTAuNjcxNTcyOSA4OSwxMS41IEM4OSwxMi4zMjg0MjcxIDg5LjY3MTU3MjksMTMgOTAuNSwxMyBaIiBpZD0iT3ZhbC05Ij48L3BhdGg+ICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTk2LjUsMTggQzk3LjMyODQyNzEsMTggOTgsMTcuMzI4NDI3MSA5OCwxNi41IEM5OCwxNS42NzE1NzI5IDk3LjMyODQyNzEsMTUgOTYuNSwxNSBDOTUuNjcxNTcyOSwxNSA5NSwxNS42NzE1NzI5IDk1LDE2LjUgQzk1LDE3LjMyODQyNzEgOTUuNjcxNTcyOSwxOCA5Ni41LDE4IFoiIGlkPSJPdmFsLTkiPjwvcGF0aD4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTAxLjUsMjQgQzEwMi4zMjg0MjcsMjQgMTAzLDIzLjMyODQyNzEgMTAzLDIyLjUgQzEwMywyMS42NzE1NzI5IDEwMi4zMjg0MjcsMjEgMTAxLjUsMjEgQzEwMC42NzE1NzMsMjEgMTAwLDIxLjY3MTU3MjkgMTAwLDIyLjUgQzEwMCwyMy4zMjg0MjcxIDEwMC42NzE1NzMsMjQgMTAxLjUsMjQgWiIgaWQ9Ik92YWwtOSI+PC9wYXRoPiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMDQuNSwzMSBDMTA1LjMyODQyNywzMSAxMDYsMzAuMzI4NDI3MSAxMDYsMjkuNSBDMTA2LDI4LjY3MTU3MjkgMTA1LjMyODQyNywyOCAxMDQuNSwyOCBDMTAzLjY3MTU3MywyOCAxMDMsMjguNjcxNTcyOSAxMDMsMjkuNSBDMTAzLDMwLjMyODQyNzEgMTAzLjY3MTU3MywzMSAxMDQuNSwzMSBaIiBpZD0iT3ZhbC05Ij48L3BhdGg+ICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTExMy41LDc1IEMxMTQuMzI4NDI3LDc1IDExNSw3NC4zMjg0MjcxIDExNSw3My41IEMxMTUsNzIuNjcxNTcyOSAxMTQuMzI4NDI3LDcyIDExMy41LDcyIEMxMTIuNjcxNTczLDcyIDExMiw3Mi42NzE1NzI5IDExMiw3My41IEMxMTIsNzQuMzI4NDI3MSAxMTIuNjcxNTczLDc1IDExMy41LDc1IFoiIGlkPSJPdmFsLTkiPjwvcGF0aD4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTE0LjUsODUgQzExNS4zMjg0MjcsODUgMTE2LDg0LjMyODQyNzEgMTE2LDgzLjUgQzExNiw4Mi42NzE1NzI5IDExNS4zMjg0MjcsODIgMTE0LjUsODIgQzExMy42NzE1NzMsODIgMTEzLDgyLjY3MTU3MjkgMTEzLDgzLjUgQzExMyw4NC4zMjg0MjcxIDExMy42NzE1NzMsODUgMTE0LjUsODUgWiIgaWQ9Ik92YWwtOSI+PC9wYXRoPiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMTUuNSw5NiBDMTE2LjMyODQyNyw5NiAxMTcsOTUuMzI4NDI3MSAxMTcsOTQuNSBDMTE3LDkzLjY3MTU3MjkgMTE2LjMyODQyNyw5MyAxMTUuNSw5MyBDMTE0LjY3MTU3Myw5MyAxMTQsOTMuNjcxNTcyOSAxMTQsOTQuNSBDMTE0LDk1LjMyODQyNzEgMTE0LjY3MTU3Myw5NiAxMTUuNSw5NiBaIiBpZD0iT3ZhbC05Ij48L3BhdGg+ICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTExNi41LDEwNCBDMTE3LjMyODQyNywxMDQgMTE4LDEwMy4zMjg0MjcgMTE4LDEwMi41IEMxMTgsMTAxLjY3MTU3MyAxMTcuMzI4NDI3LDEwMSAxMTYuNSwxMDEgQzExNS42NzE1NzMsMTAxIDExNSwxMDEuNjcxNTczIDExNSwxMDIuNSBDMTE1LDEwMy4zMjg0MjcgMTE1LjY3MTU3MywxMDQgMTE2LjUsMTA0IFoiIGlkPSJPdmFsLTkiPjwvcGF0aD4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTE3LjUsMTEzIEMxMTguMzI4NDI3LDExMyAxMTksMTEyLjMyODQyNyAxMTksMTExLjUgQzExOSwxMTAuNjcxNTczIDExOC4zMjg0MjcsMTEwIDExNy41LDExMCBDMTE2LjY3MTU3MywxMTAgMTE2LDExMC42NzE1NzMgMTE2LDExMS41IEMxMTYsMTEyLjMyODQyNyAxMTYuNjcxNTczLDExMyAxMTcuNSwxMTMgWiIgaWQ9Ik92YWwtOSI+PC9wYXRoPiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMDcuNSwxMTggQzEwOC4zMjg0MjcsMTE4IDEwOSwxMTcuMzI4NDI3IDEwOSwxMTYuNSBDMTA5LDExNS42NzE1NzMgMTA4LjMyODQyNywxMTUgMTA3LjUsMTE1IEMxMDYuNjcxNTczLDExNSAxMDYsMTE1LjY3MTU3MyAxMDYsMTE2LjUgQzEwNiwxMTcuMzI4NDI3IDEwNi42NzE1NzMsMTE4IDEwNy41LDExOCBaIiBpZD0iT3ZhbC05Ij48L3BhdGg+ICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTEwNy41LDExOCBDMTA4LjMyODQyNywxMTggMTA5LDExNy4zMjg0MjcgMTA5LDExNi41IEMxMDksMTE1LjY3MTU3MyAxMDguMzI4NDI3LDExNSAxMDcuNSwxMTUgQzEwNi42NzE1NzMsMTE1IDEwNiwxMTUuNjcxNTczIDEwNiwxMTYuNSBDMTA2LDExNy4zMjg0MjcgMTA2LjY3MTU3MywxMTggMTA3LjUsMTE4IFoiIGlkPSJPdmFsLTkiPjwvcGF0aD4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNOTUuNSwxMjEgQzk2LjMyODQyNzEsMTIxIDk3LDEyMC4zMjg0MjcgOTcsMTE5LjUgQzk3LDExOC42NzE1NzMgOTYuMzI4NDI3MSwxMTggOTUuNSwxMTggQzk0LjY3MTU3MjksMTE4IDk0LDExOC42NzE1NzMgOTQsMTE5LjUgQzk0LDEyMC4zMjg0MjcgOTQuNjcxNTcyOSwxMjEgOTUuNSwxMjEgWiIgaWQ9Ik92YWwtOSI+PC9wYXRoPiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik04MS41LDEyNCBDODIuMzI4NDI3MSwxMjQgODMsMTIzLjMyODQyNyA4MywxMjIuNSBDODMsMTIxLjY3MTU3MyA4Mi4zMjg0MjcxLDEyMSA4MS41LDEyMSBDODAuNjcxNTcyOSwxMjEgODAsMTIxLjY3MTU3MyA4MCwxMjIuNSBDODAsMTIzLjMyODQyNyA4MC42NzE1NzI5LDEyNCA4MS41LDEyNCBaIiBpZD0iT3ZhbC05Ij48L3BhdGg+ICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTY3LjUsMTI2IEM2OC4zMjg0MjcxLDEyNiA2OSwxMjUuMzI4NDI3IDY5LDEyNC41IEM2OSwxMjMuNjcxNTczIDY4LjMyODQyNzEsMTIzIDY3LjUsMTIzIEM2Ni42NzE1NzI5LDEyMyA2NiwxMjMuNjcxNTczIDY2LDEyNC41IEM2NiwxMjUuMzI4NDI3IDY2LjY3MTU3MjksMTI2IDY3LjUsMTI2IFoiIGlkPSJPdmFsLTkiPjwvcGF0aD4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNTMuNSwxMjYgQzU0LjMyODQyNzEsMTI2IDU1LDEyNS4zMjg0MjcgNTUsMTI0LjUgQzU1LDEyMy42NzE1NzMgNTQuMzI4NDI3MSwxMjMgNTMuNSwxMjMgQzUyLjY3MTU3MjksMTIzIDUyLDEyMy42NzE1NzMgNTIsMTI0LjUgQzUyLDEyNS4zMjg0MjcgNTIuNjcxNTcyOSwxMjYgNTMuNSwxMjYgWiIgaWQ9Ik92YWwtOSI+PC9wYXRoPiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0zOS41LDEyNiBDNDAuMzI4NDI3MSwxMjYgNDEsMTI1LjMyODQyNyA0MSwxMjQuNSBDNDEsMTIzLjY3MTU3MyA0MC4zMjg0MjcxLDEyMyAzOS41LDEyMyBDMzguNjcxNTcyOSwxMjMgMzgsMTIzLjY3MTU3MyAzOCwxMjQuNSBDMzgsMTI1LjMyODQyNyAzOC42NzE1NzI5LDEyNiAzOS41LDEyNiBaIiBpZD0iT3ZhbC05Ij48L3BhdGg+ICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTI3LjUsMTIzIEMyOC4zMjg0MjcxLDEyMyAyOSwxMjIuMzI4NDI3IDI5LDEyMS41IEMyOSwxMjAuNjcxNTczIDI4LjMyODQyNzEsMTIwIDI3LjUsMTIwIEMyNi42NzE1NzI5LDEyMCAyNiwxMjAuNjcxNTczIDI2LDEyMS41IEMyNiwxMjIuMzI4NDI3IDI2LjY3MTU3MjksMTIzIDI3LjUsMTIzIFoiIGlkPSJPdmFsLTkiPjwvcGF0aD4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTIuNSwxMjAgQzEzLjMyODQyNzEsMTIwIDE0LDExOS4zMjg0MjcgMTQsMTE4LjUgQzE0LDExNy42NzE1NzMgMTMuMzI4NDI3MSwxMTcgMTIuNSwxMTcgQzExLjY3MTU3MjksMTE3IDExLDExNy42NzE1NzMgMTEsMTE4LjUgQzExLDExOS4zMjg0MjcgMTEuNjcxNTcyOSwxMjAgMTIuNSwxMjAgWiIgaWQ9Ik92YWwtOSI+PC9wYXRoPiAgICAgICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwtOSIgY3g9IjIuNSIgY3k9IjEwNC41IiByPSIxLjUiPjwvY2lyY2xlPiAgICAgICAgICAgICAgICAgICAgPC9nPiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9IkV5ZXMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQzLjAwMDAwMCwgNzUuMDAwMDAwKSIgc3Ryb2tlPSIjMjQxODA4Ij4gICAgICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9IiNGRkZGRkYiIGN4PSIyMiIgY3k9IjI1IiByPSIyMiI+PC9jaXJjbGU+ICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbCIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSIjRkZGRkZGIiBjeD0iOTMiIGN5PSIyMi45NzIzNzciIHI9IjIyIj48L2NpcmNsZT4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNOTMsMzMgQzk4LjUyMjg0NzUsMzMgMTAzLDI4LjUyMjg0NzUgMTAzLDIzIEMxMDMsMTcuNDc3MTUyNSA5OC41MjI4NDc1LDEzIDkzLDEzIEM4Ny40NzcxNTI1LDEzIDgzLDE3LjQ3NzE1MjUgODMsMjMgQzgzLDI4LjUyMjg0NzUgODcuNDc3MTUyNSwzMyA5MywzMyBaIiBpZD0iT3ZhbC0yIiBmaWxsPSIjMjQxODA4Ij48L3BhdGg+ICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTIxLjUsMzQgQzI2LjE5NDQyMDQsMzQgMzAsMzAuMTk0NDIwNCAzMCwyNS41IEMzMCwyMC44MDU1Nzk2IDI2LjE5NDQyMDQsMTcgMjEuNSwxNyBDMTYuODA1NTc5NiwxNyAxMywyMC44MDU1Nzk2IDEzLDI1LjUgQzEzLDMwLjE5NDQyMDQgMTYuODA1NTc5NiwzNCAyMS41LDM0IFoiIGlkPSJPdmFsLTIiIGZpbGw9IiMyNDE4MDgiPjwvcGF0aD4gICAgICAgICAgICAgICAgICAgIDwvZz4gICAgICAgICAgICAgICAgICAgIDxnIGlkPSJOb3NlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4My4wMDAwMDAsIDExNi4wMDAwMDApIiBmaWxsPSIjNjU2NTY1Ij4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNC40NTg4NTk3Miw0LjA1Nzc5MDMyIEMwLjg1MTQ4OTY4NywtMC42MzIxMDgzMDMgMjcuMTI0Nzc1MSwtMC4yNDMwNTYyMTUgMzAuNjU1OTQwNywyLjIzMDA5NDA4IEMzNC4xODcxMDYzLDQuNzAzMjQ0MzggMjkuNTY2NDQ0LDEwLjAxMjIwNzkgMTcuNjM1MDAwMiwxNS45MjcwNjE1IEMxMS4xMTUzOTA2LDExLjM2MDg3MDcgOC4wNjYyMjk3NCw4Ljc0NzY4ODk0IDQuNDU4ODU5NzIsNC4wNTc3OTAzMiBaIiBpZD0iUGF0aC0xMiI+PC9wYXRoPiAgICAgICAgICAgICAgICAgICAgPC9nPiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Ik1vdXRoIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2OS4wMDAwMDAsIDE0NC4wMDAwMDApIiBzdHJva2U9IiMyNDE4MDgiPiAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgaWQ9IlJlY3RhbmdsZS01IiBtYXNrPSJ1cmwoI21hc2stMikiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBmaWxsPSIjRkZGRkZGIiB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4gICAgICAgICAgICAgICAgICAgICAgICA8cG9seWxpbmUgaWQ9IlBhdGgtMTEwIiBzdHJva2Utd2lkdGg9IjIiIHBvaW50cz0iMTAuNjE2ODIxNyAxNS43OTIzMzkxIDEwLjYxNjgyMTcgMS4wNzEyMDA0MyAxNi44NjMyNjY0IDEuMDcxMjAwNDMgMTYuODYzMjY2NCAxNS4zMTc5Mjc0IDIyLjM0OTE3MiAxNS4zMTc5Mjc0IDIyLjM0OTE3MiAxLjA3MTIwMDQzIDI4LjE3MDIxNzkgMS4wNzEyMDA0MyAyOC4xNzAyMTc5IDE1LjMxNzkyNzQgMzMuMTM5OTA0NCAxNS4zMTc5Mjc0IDMzLjEzOTkwNDQgMS4wNzEyMDA0MyAzOC42OTU5NjUyIDEuMDcxMjAwNDMgMzguNjk1OTY1MiAxNS4zMTc5Mjc0IDQzLjk2NDYyMjkgMTUuMzE3OTI3NCA0My45NjQ2MjI5IDEuMDcxMjAwNDMgNDkuMzI3MzkzIDEuMDcxMjAwNDMgNDkuMzI3Mzk0NiAxNS41MjI1OTU5Ij48L3BvbHlsaW5lPiAgICAgICAgICAgICAgICAgICAgPC9nPiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9IldoaXNrZXJzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCwgMTI0LjAwMDAwMCkiPiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik02My42NTM3ODk2LDguMzk5NjQxODYgQzYzLjY1Mzc4OTYsOC4zOTk2NDE4NiA0My42NTk1Nzg1LC0yLjEwMzUyMTMyIDUuNjUwNzI4MzcsMy4xNDgwNjAyNyIgaWQ9IlBhdGgtNCIgc3Ryb2tlPSIjMjQxODA4IiBzdHJva2UtbGluZWNhcD0icm91bmQiPjwvcGF0aD4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNjkuOTk2ODY2NiwxOC40NDYzNjE1IEM2OS45OTY4NjY2LDE4LjQ0NjM2MTUgNTYuNTU3ODMsMTAuNDk4MjkwNCAxMS42NDQwMzA3LDE3LjgyODY3NDMiIGlkPSJQYXRoLTUiIHN0cm9rZT0iIzI0MTgwOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj48L3BhdGg+ICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTEzNS4zNDY0MzcsOC4yMTczMTI1IEMxMzUuMzQ2NDM3LDguMjE3MzEyNSAxNTYuMTU1NTQ3LC0wLjY1NDA4MjE2NiAxOTQuNjI5NTI0LDIuMTIzNTQyOTQiIGlkPSJQYXRoLTYiIHN0cm9rZT0iIzI0MTgwOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj48L3BhdGg+ICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTEyOS4wNTA0OTIsMTguMDk1MzQ2NCBDMTI5LjA1MDQ5MiwxOC4wOTUzNDY0IDE0NS40MzI4NDQsMTEuNjEzMzUxOCAxOTAuMzcxNDUyLDE3LjQ5OTk4NTMiIGlkPSJQYXRoLTciIHN0cm9rZT0iIzI0MTgwOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj48L3BhdGg+ICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE0NC42MzUzMTEsMTAuNDIyNjI5NSBDMTQ0LjYzNTMxMSwxMC40MjI2Mjk1IDE3OS42ODIyNDEsMi42NTkzNjgzOSAxOTkuODYwMDIsMTAuODM1NjYxMyIgaWQ9IlBhdGgtOCIgc3Ryb2tlPSIjMjQxODA4IiBzdHJva2UtbGluZWNhcD0icm91bmQiPjwvcGF0aD4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNTMuNjQwNTU5LDkuMDY2OTQyNDkgQzUzLjY0MDU1OSw5LjA2Njk0MjQ5IDI1LjYwNTI0OTQsMy4wNTk5OTY0MyAxLjcwMjczOTY3LDEzLjg5MzA4ODkiIGlkPSJQYXRoLTkiIHN0cm9rZT0iIzI0MTgwOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj48L3BhdGg+ICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC03IiBmaWxsPSIjMjQxODA4IiBjeD0iNiIgY3k9IjMiIHI9IjIiPjwvY2lyY2xlPiAgICAgICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwtNyIgZmlsbD0iIzI0MTgwOCIgY3g9IjIiIGN5PSIxNCIgcj0iMiI+PC9jaXJjbGU+ICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC03IiBmaWxsPSIjMjQxODA4IiBjeD0iMTIiIGN5PSIxOCIgcj0iMiI+PC9jaXJjbGU+ICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC03IiBmaWxsPSIjMjQxODA4IiBjeD0iMTk1IiBjeT0iMiIgcj0iMiI+PC9jaXJjbGU+ICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC03IiBmaWxsPSIjMjQxODA4IiBjeD0iMTk5IiBjeT0iMTEiIHI9IjIiPjwvY2lyY2xlPiAgICAgICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwtNyIgZmlsbD0iIzI0MTgwOCIgY3g9IjE5MSIgY3k9IjE4IiByPSIyIj48L2NpcmNsZT4gICAgICAgICAgICAgICAgICAgIDwvZz4gICAgICAgICAgICAgICAgICAgIDxnIGlkPSJFYXJzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1NC4wMDAwMDAsIDI4LjAwMDAwMCkiPiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik04Ljg3ODAxMTgsMzEuMjcyNjQ3NSBMMTAuODk1MzA2NCwxNy41OTQ1NTQ5IEMxMC44OTUzMDY0LDE3LjU5NDU1NDkgMTIuMDAyNzcyMywxNS40Njk4OTc0IDEzLjc3MDI0MDIsMTYuNzAzMDAyIEMxNS41Mzc3MDgyLDE3LjkzNjEwNjYgMjAuMDQ1NDE3OSwyMi4zMjc0MDcgMjAuMDQ1NDE3OSwyMi4zMjc0MDcgTDguODc4MDExOCwzMS4yNzI2NDc1IFoiIGlkPSJQYXRoLTEzIiBmaWxsPSIjNjU2NTY1Ij48L3BhdGg+ICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTcyLjE1OTkzNzYsMjIuMDI5NzUwOCBMNzcuMjQ4MDI2OCwxNi4wODE1NjI4IEM3Ny4yNDgwMjY4LDE2LjA4MTU2MjggODAuMTU4MTQ2NiwxNC4xMjE2MzkgODAuMzY3MzA2OSwxNy41NTU0NTk1IEM4MC41NzY0NjczLDIwLjk4OTI4IDgxLjk2OTU0MTMsMjkuMjM4MzM1OCA4MS45Njk1NDEzLDI5LjIzODMzNTggTDcyLjE1OTkzNzYsMjIuMDI5NzUwOCBaIiBpZD0iUGF0aC0xNCIgZmlsbD0iIzY1NjU2NSI+PC9wYXRoPiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0wLjc4MzU0MTM0MSw0Mi43ODc3MjEgQzAuNzgzNTQxMzQxLDQyLjc4NzcyMSAxMC4zMjQxODQxLDI1Ljc1NjkyNjggMjYuMDkzNTIwMywxOS44MzAzODM1IiBpZD0iUGF0aC0xNSIgc3Ryb2tlPSIjMjQxODA4IiBzdHJva2Utd2lkdGg9IjIiPjwvcGF0aD4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNODguOTczNjQxOCwzOC40NjA0NTA0IEM4OC45NzM2NDE4LDM4LjQ2MDQ1MDQgODIuMDc3OTM3NSwyNC45ODEzNDQyIDY0LjU3NDcxNzksMjAuMTQ4MjQ0MyIgaWQ9IlBhdGgtMTYiIHN0cm9rZT0iIzI0MTgwOCIgc3Ryb2tlLXdpZHRoPSIyIj48L3BhdGg+ICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTkuNjA4MDcwODEsNi4xODQxOTY4OCBDOC4wNTA4NDE4OCw2LjUwMzYyOTE0IDUuMDc5Mjg3OTgsMTEuMDYwOTI0OSA1LjA3OTI4Nzk4LDExLjA2MDkyNDkgTDYuNTExMTYwODksMC42NTkyNTQ0ODMgTDE2Ljg4ODk0Niw4LjU0OTY3MzQ5IEMxNi44ODg5NDYsOC41NDk2NzM0OSAxMS43NDcwMjcxLDUuNzQ1NDM1NjcgOS42MDgwNzA4MSw2LjE4NDE5Njg4IFoiIGlkPSJQYXRoLTEwNyIgc3Ryb2tlPSIjMjQxODA4IiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBmaWxsPSIjMjQxODA4Ij48L3BhdGg+ICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTgxLjM5MTk2NzIsNy4yMzc4MzE4NyBDNzkuNzgzMTQ2Nyw2LjkyODg5MTM1IDc1Ljc1NjAzMzYsOC41NTgwMjEzNCA3NS43NTYwMzM2LDguNTU4MDIxMzQgTDgyLjg3NTc0MDksMi41ODg5MDEzMiBMODUuMTg3MTAwMSwxMS40ODI0MDE2IEM4NS4xODcxMDAxLDExLjQ4MjQwMTYgODMuMTIzNTM3Nyw3LjU3MDM0Mzk2IDgxLjM5MTk2NzIsNy4yMzc4MzE4NyBaIiBpZD0iUGF0aC0xMDgiIHN0cm9rZT0iIzI0MTgwOCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZmlsbD0iIzI0MTgwOCI+PC9wYXRoPiAgICAgICAgICAgICAgICAgICAgPC9nPiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9IkFudGVubmEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDkyLjAwMDAwMCwgMC4wMDAwMDApIiBzdHJva2U9IiMyNDE4MDgiIGZpbGw9IiNBRkFGQUYiPiAgICAgICAgICAgICAgICAgICAgICAgIDx1c2UgaWQ9IlJlY3RhbmdsZS02IiBtYXNrPSJ1cmwoI21hc2stNCkiIHN0cm9rZS13aWR0aD0iNCIgeGxpbms6aHJlZj0iI3BhdGgtMyI+PC91c2U+ICAgICAgICAgICAgICAgICAgICAgICAgPHVzZSBpZD0iUmVjdGFuZ2xlLTYiIG1hc2s9InVybCgjbWFzay02KSIgc3Ryb2tlLXdpZHRoPSI0IiB4bGluazpocmVmPSIjcGF0aC01Ij48L3VzZT4gICAgICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsLTgiIHN0cm9rZS13aWR0aD0iMiIgY3g9IjcuNSIgY3k9IjcuNSIgcj0iNy41Ij48L2NpcmNsZT4gICAgICAgICAgICAgICAgICAgIDwvZz4gICAgICAgICAgICAgICAgPC9nPiAgICAgICAgICAgIDwvZz4gICAgICAgICAgICA8ZyBpZD0iU3dlYXRlciIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzUuMDAwMDAwLCAxNjMuMDAwMDAwKSI+ICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0wLjQ4NDY1MjA2MSw2NS44OTEzMzg0IEwyLjQ5MjcxMTU2LDAuNjg0NDg5NjUyIEMyLjQ5MjcxMTU2LDAuNjg0NDg5NjUyIDUzLjg0MTg5MzYsMjcuNzMxOTUyMiAxMjUuNTE0NDY5LDAuNjg0NDg5NjUyIEMxMjYuNjM3MDk4LDAuMjYwODM3MDk4IDEyNi45NjU4MjMsOC43NTc2NDIxMiAxMjYuOTY1ODIzLDguNzU3NjQyMTIgTDEzMS4wNDkwODgsNjYuODk0NDc5NiBMMC40ODQ2NTIwNjEsNjUuODkxMzM4NCBaIiBpZD0iUGF0aC02NyIgc3Ryb2tlPSIjMjQxODA4IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZmlsbD0iIzBBMzI1MiI+PC9wYXRoPiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMiwxMCBDMiwxMCA1NS4yNjQ2OTQ4LDM1Ljc5MTgyNzcgMTI2LjQyNTAzNCw4LjYwMjk2NTg1IiBpZD0iUGF0aC02NiIgc3Ryb2tlPSIjMjQxODA4IiBzdHJva2Utd2lkdGg9IjIiPjwvcGF0aD4gICAgICAgICAgICAgICAgPGcgaWQ9IkZpYmVycy1kYXJrIiBvcGFjaXR5PSIwLjQ2MDIwMTU0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5LjAwMDAwMCwgMjAuMDAwMDAwKSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTAuNDcxMTMzNDAxLDAuNzAyNzc1OTg2IEwwLjM3NzMzNjI4NCwzLjM4OTk1MTcyIiBpZD0iUGF0aC02NSIgc3Ryb2tlPSIjMjQxODA4Ij48L3BhdGg+ICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNi42NTE2OTM0Myw1LjYzOTk2NTkgTDYuNzQ4MjgyMTMsOC4wNTU3OTk5OCIgaWQ9IlBhdGgtNjgiIHN0cm9rZT0iIzI0MTgwOCI+PC9wYXRoPiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE2LjU2MjkyMjEsMTguNjQwOTE2MyBMMTYuNzk0NjIzMywxNi4wMzc0ODgiIGlkPSJQYXRoLTcxIiBzdHJva2U9IiMyNDE4MDgiPjwvcGF0aD4gICAgICAgICAgICAgICAgICAgIDxwb2x5bGluZSBpZD0iUGF0aC03NCIgc3Ryb2tlPSIjMjQxODA4IiBwb2ludHM9IjMwLjkxMTY0NzggMTEuOTc0NjIxMiAzMC45MTE2NDc4IDExLjUxNTEyNyAzMC45MTE2NDc4IDExLjQ2ODIyODQgMzAuOTExNjQ3OCAxMS4zNjcxNzMyIDMwLjkxMTY0NzggMTEuMzIwMjc0NiAzMC45MTE2NDc4IDExLjIxOTIxOTQgMzAuOTExNjQ3OCAxMS4xNzIzMjA5IDMwLjkxMTY0NzggMTEuMDcxMjY1NiAzMC45MTE2NDc4IDEwLjk3MDIxMDQgMzAuOTExNjQ3OCAxMC44NzY0MTMzIDMwLjkxMTY0NzggMTAuNzc1MzU4MSAzMC45MTE2NDc4IDEwLjU3MzI0NzYgMzAuOTExNjQ3OCAxMC41MjYzNDkgMzAuOTExNjQ3OCAxMC4zNzgzOTUzIDMwLjkxMTY0NzggMTAuMzMxNDk2NyAzMC45MTE2NDc4IDEwLjI4NDU5ODEgMzAuOTExNjQ3OCAxMC4yMzc2OTk2IDMwLjkxMTY0NzggMTAuMTkwODAxIDMwLjkxMTY0NzggMTAuMTQzOTAyNSAzMC45MTE2NDc4IDEwLjA5NzAwMzkgMzAuOTExNjQ3OCAxMC4wMDMyMDY4IDMwLjkxMTY0NzggOS45NTYzMDgyMyAzMC45MTE2NDc4IDkuODYyNTExMTEgMzAuOTExNjQ3OCA5LjgxNTYxMjU1IDMwLjkxMTY0NzggOS43Njg3MTM5OSAzMC45MTE2NDc4IDkuNzIxODE1NDMgMzAuOTExNjQ3OCA5LjY3NDkxNjg4IDMwLjkxMTY0NzggOS42MjgwMTgzMiAzMC45MTE2NDc4IDkuNTgxMTE5NzYgMzAuOTExNjQ3OCA5LjUzNDIyMTIgMzAuOTExNjQ3OCA5LjQ4NzMyMjY0IDMwLjkxMTY0NzggOS40NDA0MjQwOCAzMC45MTE2NDc4IDkuMzkzNTI1NTMgMzAuOTExNjQ3OCA5LjM0NjYyNjk3IDMwLjkxMTY0NzggOS4zOTI5NjcyMSI+PC9wb2x5bGluZT4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik00Ni4zNzg2ODA3LDExLjEyOTMzMDUgQzQ2LjMxNjE0OTMsMTAuNjI3NDA0MyA0Ni4yNTM2MTc5LDEwLjEyNTQ3OCA0Ni4xOTEwODY0LDkuNjIzNTUxNzkiIGlkPSJQYXRoLTc1IiBzdHJva2U9IiMyNDE4MDgiPjwvcGF0aD4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik02Mi41ODMyNDkzLDEwLjExMDk2MTggTDYyLjY3NTkyOTcsOS41OTUwNzc2NiIgaWQ9IlBhdGgtNzYiIHN0cm9rZT0iIzI0MTgwOCI+PC9wYXRoPiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTc3LjM1MDE1MzcsMTQuMTAwNjg5MiBMNzcuMzAzMjU1MSwxMS43OTIwNTE4IiBpZD0iUGF0aC03NyIgc3Ryb2tlPSIjMjQxODA4Ij48L3BhdGg+ICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNOTMuODA5ODcyOCwxMS45Njk1OTYzIEw5My4yODY3MzA1LDguODkyMTU3NiIgaWQ9IlBhdGgtODIiIHN0cm9rZT0iIzI0MTgwOCI+PC9wYXRoPiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTEwNi45MTUyMjgsOS42MDUxMjczNSBMMTA2LjEyNzQ0NCw2LjQxMjExNzE2IiBpZD0iUGF0aC04MyIgc3Ryb2tlPSIjMjQxODA4Ij48L3BhdGg+ICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTEyLjY4MjYzNCwyMS41NjA5MDk5IEwxMTEuMzAxOTE4LDE4Ljk4ODE4ODkiIGlkPSJQYXRoLTg0IiBzdHJva2U9IiMyNDE4MDgiPjwvcGF0aD4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9IiIgaWQ9IlBhdGgtODciIHN0cm9rZT0iIzk3OTc5NyI+PC9wYXRoPiAgICAgICAgICAgICAgICA8L2c+ICAgICAgICAgICAgICAgIDxnIGlkPSJGaWJlcnMtbGlnaHQiIG9wYWNpdHk9IjAuMjU5Mjg0NDIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDcuMDAwMDAwLCAxOS4wMDAwMDApIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+ICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjAuNTYxMTM1Nyw5LjMyMzIzMzQyIEMyMC40OTczMDE2LDguNDg4NzM2ODUgMjAuNDMzNDY3NCw3LjY1NDI0MDI4IDIwLjM2OTYzMzMsNi44MTk3NDM3MSIgaWQ9IlBhdGgtODgiIHN0cm9rZT0iI0ZGRkVGRSIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PC9wYXRoPiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTEwLjc3ODMxOTcsMTguMTk2NTUyNCBMMTAuMTYxMzgwNCwxNS45NTEwMDQ3IiBpZD0iUGF0aC04OSIgc3Ryb2tlPSIjRkZGRUZFIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48L3BhdGg+ICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjguMjc3MDY1MiwyMi4xMDg2NzM4IEMyOC4xMzQzMjI0LDIxLjIwOTA0MDMgMjcuOTkxNTc5NSwyMC4zMDk0MDY5IDI3Ljg0ODgzNjcsMTkuNDA5NzczNCIgaWQ9IlBhdGgtOTMiIHN0cm9rZT0iI0ZGRkVGRSIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PC9wYXRoPiAgICAgICAgICAgICAgICAgICAgPHBvbHlsaW5lIGlkPSJQYXRoLTk0IiBzdHJva2U9IiNGRkZFRkUiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHBvaW50cz0iMzkuNTcwNjg0NyAxOS44NjI1Njc4IDM5LjU3MDY4NDcgMTkuMzE3MDkyOSAzOS41NzA2ODQ3IDE5LjE1MzUwNjMgMzkuNTcwNjg0NyAxOC44MjYzMzMgMzkuNTcwNjg0NyAxOC42NjI3NDY0IDM5LjU3MDY4NDcgMTguNTYxNjkxMSAzOS41NzA2ODQ3IDE4LjQ2MDYzNTkgMzkuNTcwNjg0NyAxOC40MTM3MzczIDM5LjU3MDY4NDcgMTguMjY1NzgzNiAzOS41NzA2ODQ3IDE4LjE2NDcyODMgMzkuNTcwNjg0NyAxOC4wNzA5MzEyIDM5LjU3MDY4NDcgMTcuOTc3MTM0MSAzOS41NzA2ODQ3IDE3LjkzMDIzNTUgMzkuNTcwNjg0NyAxNy44ODMzMzcgMzkuNTcwNjg0NyAxNy44MzY0Mzg0IDM5LjU3MDY4NDcgMTcuNzg5NTM5OSAzOS41NzA2ODQ3IDE3Ljc0MjY0MTMgMzkuNTcwNjg0NyAxNy42OTU3NDI3IDM5LjU3MDY4NDcgMTcuNjQ4ODQ0MiAzOS41NzA2ODQ3IDE3LjYwMTk0NTYgMzkuNTcwNjg0NyAxNy42NDgyODU5IDM5LjU3MDY4NDcgMTcuNjk0NjI2MSAzOS41NzA2ODQ3IDE3Ljc0MDk2NjQiPjwvcG9seWxpbmU+ICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNOTMuMDY5MDk4NywyMS4xNDU1Nzg0IEw5Mi45MjExNDQ5LDE3Ljg1Mzc0NjIiIGlkPSJQYXRoLTk5IiBzdHJva2U9IiNGRkZFRkUiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjwvcGF0aD4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMTMuMzQ2NTg0LDMuNTY4NjY4NjMgTDExMy4wNjUxOTIsMC41MTE4ODc1OSIgaWQ9IlBhdGgtMTAwIiBzdHJva2U9IiNGRkZFRkUiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjwvcGF0aD4gICAgICAgICAgICAgICAgICAgIDxwb2x5bGluZSBpZD0iUGF0aC0xMDEiIHN0cm9rZT0iI0ZGRkVGRSIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgcG9pbnRzPSIxMDQuNTY3MDYyIDE3LjAzOTcyMTIgMTA0LjU2NzA2MiAxNi42MDMxMTggMTA0LjU2NzA2MiAxNi41NTYyMTk0IDEwNC41NjcwNjIgMTYuNTA5MzIwOSAxMDQuNTY3MDYyIDE2LjQ2MjQyMjMgMTA0LjU2NzA2MiAxNi40MTU1MjM4IDEwNC41NjcwNjIgMTYuMzY4NjI1MiAxMDQuNTY3MDYyIDE2LjMyMTcyNjYgMTA0LjU2NzA2MiAxNi4yMjc5Mjk1IDEwNC41NjcwNjIgMTYuMTgxMDMxIDEwNC41NjcwNjIgMTYuMTM0MTMyNCAxMDQuNTY3MDYyIDE2LjA4NzIzMzkgMTA0LjU2NzA2MiAxNi4wNDAzMzUzIDEwNC41NjcwNjIgMTUuOTkzNDM2NyAxMDQuNTY3MDYyIDE1Ljk0NjUzODIgMTA0LjU2NzA2MiAxNS44OTk2Mzk2IDEwNC41NjcwNjIgMTUuODUyNzQxMSAxMDQuNTY3MDYyIDE1LjgwNTg0MjUgMTA0LjU2NzA2MiAxNS43NTg5NDM5IDEwNC41NjcwNjIgMTUuNzEyMDQ1NCAxMDQuNTY3MDYyIDE1LjY2NTE0NjggMTA0LjU2NzA2MiAxNS42MTgyNDgzIDEwNC41NjcwNjIgMTUuNTI0NDUxMSAxMDQuNTY3MDYyIDE1LjQ3NzU1MjYgMTA0LjU2NzA2MiAxNS40MzA2NTQgMTA0LjU2NzA2MiAxNS4zODM3NTU1IDEwNC41NjcwNjIgMTUuMzM2ODU2OSAxMDQuNTY3MDYyIDE1LjI4OTk1ODQgMTA0LjU2NzA2MiAxNS4yNDMwNTk4IDEwNC41NjcwNjIgMTUuMTk2MTYxMiAxMDQuNTY3MDYyIDE1LjE0OTI2MjcgMTA0LjU2NzA2MiAxNS4xMDIzNjQxIDEwNC41NjcwNjIgMTUuMDU1NDY1NiAxMDQuNTY3MDYyIDE1LjAwODU2NyAxMDQuNTY3MDYyIDE0Ljk2MTY2ODQgMTA0LjU2NzA2MiAxNC45MTQ3Njk5IDEwNC41NjcwNjIgMTQuODY3ODcxMyAxMDQuNTY3MDYyIDE0LjgyMDk3MjggMTA0LjU2NzA2MiAxNC43NzQwNzQyIDEwNC41NjcwNjIgMTQuNzI3MTc1NyAxMDQuNTY3MDYyIDE0LjY4MDI3NzEgMTA0LjU2NzA2MiAxNC42MzMzNzg1IDEwNC41NjcwNjIgMTQuNTg2NDgiPjwvcG9seWxpbmU+ICAgICAgICAgICAgICAgICAgICA8cG9seWxpbmUgaWQ9IlBhdGgtMTAzIiBzdHJva2U9IiNGRkZERkQiIHBvaW50cz0iMC45ODYxODc0MzEgMTguMzk3ODYyNCAwLjk4NjE4NzQzMSAxOS42ODM1NzYxIDAuOTg2MTg3NDMxIDE5LjgxNjQ3MDYgMC45ODYxODc0MzEgMjAuMTA0Njc1NCAwLjk4NjE4NzQzMSAyMC4zNzA0NjQzIDAuOTg2MTg3NDMxIDIwLjUwMzM1ODggMC45ODYxODc0MzEgMjAuOTI0NDU4IDAuOTg2MTg3NDMxIDIxLjA1NzM1MjUgMC45ODYxODc0MzEgMjEuMTkwMjQ2OSAwLjk4NjE4NzQzMSAyMS42MTEzNDYyIDAuOTg2MTg3NDMxIDIxLjc0NDI0MDYgMC45ODYxODc0MzEgMjEuODc3MTM1MSAwLjk4NjE4NzQzMSAyMi4wMTAwMjk1IDAuOTg2MTg3NDMxIDIyLjE0MjkyNCAwLjk4NjE4NzQzMSAyMi41NDE2MDczIDAuOTg2MTg3NDMxIDIyLjY3NDUwMTggMC45ODYxODc0MzEgMjIuODA3Mzk2MiAwLjk4NjE4NzQzMSAyMy4wNzMxODUxIDAuOTg2MTg3NDMxIDIzLjMzODk3NCAwLjk4NjE4NzQzMSAyMy40NzE4Njg1IDAuOTg2MTg3NDMxIDIzLjYwNDc2MjkgMC45ODYxODc0MzEgMjMuNzM3NjU3MyAwLjk4NjE4NzQzMSAyMy44NzA1NTE4IDAuOTg2MTg3NDMxIDI0LjAwMzQ0NjIgMC45ODYxODc0MzEgMjQuMTM2MzQwNyAwLjk4NjE4NzQzMSAyNC4yNjkyMzUxIj48L3BvbHlsaW5lPiAgICAgICAgICAgICAgICA8L2c+ICAgICAgICAgICAgICAgIDxnIGlkPSJUZXJtaW5hbC1sb2dvIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0Ni4wMDAwMDAsIDI4LjAwMDAwMCkiPiAgICAgICAgICAgICAgICAgICAgPHVzZSBpZD0iUmVjdGFuZ2xlLTciIHN0cm9rZT0iIzI0MTgwOCIgbWFzaz0idXJsKCNtYXNrLTgpIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9IiMyQTFEMEMiIHhsaW5rOmhyZWY9IiNwYXRoLTciPjwvdXNlPiAgICAgICAgICAgICAgICAgICAgPHRleHQgaWQ9IiZndDtfIiBmb250LWZhbWlseT0iQmFsb29CaGFpbmEtUmVndWxhciwgQmFsb28gQmhhaW5hIiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0ibm9ybWFsIiBmaWxsPSIjRkZGRkZGIj4gICAgICAgICAgICAgICAgICAgICAgICA8dHNwYW4geD0iMyIgeT0iMTIiPiZndDtfPC90c3Bhbj4gICAgICAgICAgICAgICAgICAgIDwvdGV4dD4gICAgICAgICAgICAgICAgPC9nPiAgICAgICAgICAgIDwvZz4gICAgICAgIDwvZz4gICAgPC9nPjwvc3ZnPg==" alt="madewithlove logo" /><h2>Uh oh, you appear to be offline!</h2></div></section></body></html>';

/* The install event fires when the service worker is first installed.
   You can use this event to prepare the service worker to be able to serve
   files while visitors are offline.
*/
self.addEventListener("install", function(event) {
  /* Using event.waitUntil(p) blocks the installation process on the provided
     promise. If the promise is rejected, the service worker won't be installed.
  */
  event.waitUntil(
    /* The caches built-in is a promise-based API that helps you cache responses,
       as well as finding and deleting them.
    */
    caches
      /* You can open a cache by name, and this method returns a promise. We use
         a versioned cache name here so that we can remove old cache entries in
         one fell swoop later, when phasing out an older service worker.
      */
      .open(version + 'fundamentals')
      .then(function(cache) {
        /* After the cache is opened, we can fill it with the offline fundamentals.
           The method below will add all resources in `offlineFundamentals` to the
           cache, after making requests for them.
        */
        return cache.addAll(offlineFundamentals);
      })
      .then(function() {
      })
  );
});

/* The fetch event fires whenever a page controlled by this service worker requests
   a resource. This isn't limited to `fetch` or even XMLHttpRequest. Instead, it
   comprehends even the request for the HTML page on first load, as well as JS and
   CSS resources, fonts, any images, etc.
*/
self.addEventListener("fetch", function(event) {

  /* We should only cache GET requests, and deal with the rest of method in the
     client-side, by handling failed POST,PUT,PATCH,etc. requests.
  */
  if (event.request.method !== 'GET') {
    /* If we don't block the event as shown below, then the request will go to
       the network as usual.
    */
    return;
  }
  /* Similar to event.waitUntil in that it blocks the fetch event on a promise.
     Fulfillment result will be used as the response, and rejection will end in a
     HTTP response indicating failure.
  */
  event.respondWith(
    caches
      /* This method returns a promise that resolves to a cache entry matching
         the request. Once the promise is settled, we can then provide a response
         to the fetch request.
      */
      .match(event.request)
      .then(function(cached) {
        /* Even if the response is in our cache, we go to the network as well.
           This pattern is known for producing "eventually fresh" responses,
           where we return cached responses immediately, and meanwhile pull
           a network response and store that in the cache.
           Read more:
           https://ponyfoo.com/articles/progressive-networking-serviceworker
        */
        var networked = fetch(event.request)
          // We handle the network request with success and failure scenarios.
          .then(fetchedFromNetwork, unableToResolve)
          // We should catch errors on the fetchedFromNetwork handler as well.
          .catch(unableToResolve);

        /* We return the cached response immediately if there is one, and fall
           back to waiting on the network as usual.
        */
        return cached || networked;

        function fetchedFromNetwork(response) {
          /* We copy the response before replying to the network request.
             This is the response that will be stored on the ServiceWorker cache.
          */
          var cacheCopy = response.clone();


          caches
            // We open a cache to store the response for this request.
            .open(version + 'pages')
            .then(function add(cache) {
              /* We store the response for this request. It'll later become
                 available to caches.match(event.request) calls, when looking
                 for cached responses.
              */
              cache.put(event.request, cacheCopy);
            })
            .then(function() {
            });

          // Return the response so that the promise is settled in fulfillment.
          return response;
        }

        /* When this method is called, it means we were unable to produce a response
           from either the cache or the network. This is our opportunity to produce
           a meaningful response even when all else fails. It's the last chance, so
           you probably want to display a "Service Unavailable" view or a generic
           error response.
        */
        function unableToResolve () {
          /* There's a couple of things we can do here.
             - Test the Accept header and then return one of the `offlineFundamentals`
               e.g: `return caches.match('/some/cached/image.png')`
             - You should also consider the origin. It's easier to decide what
               "unavailable" means for requests against your origins than for requests
               against a third party, such as an ad provider.
             - Generate a Response programmaticaly, as shown below, and return that.
          */


          /* Here we're creating a response programmatically. The first parameter is the
             response body, and the second one defines the options for the response.
          */
          return new Response(offlinePage, {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/html'
            })
          });
        }
      })
  );
});

/* The activate event fires after a service worker has been successfully installed.
   It is most useful when phasing out an older version of a service worker, as at
   this point you know that the new worker was installed correctly. In this example,
   we delete old caches that don't match the version in the worker we just finished
   installing.
*/
self.addEventListener("activate", function(event) {
  /* Just like with the install event, event.waitUntil blocks activate on a promise.
     Activation will fail unless the promise is fulfilled.
  */

  event.waitUntil(
    caches
      /* This method returns a promise which will resolve to an array of available
         cache keys.
      */
      .keys()
      .then(function (keys) {
        // We return a promise that settles when all outdated caches are deleted.
        return Promise.all(
          keys
            .filter(function (key) {
              // Filter by keys that don't start with the latest version prefix.
              return !key.startsWith(version);
            })
            .map(function (key) {
              /* Return a promise that's fulfilled
                 when each outdated cache is deleted.
              */
              return caches.delete(key);
            })
        );
      })
      .then(function() {
      })
  );
});