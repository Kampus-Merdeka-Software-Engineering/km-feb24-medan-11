<!DOCTYPE html>
<html>

<head>
    <title>Dasboard</title>
    <!-- Add Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .Btn2 {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            width: 45px;
            height: 45px;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition-duration: .3s;
            box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199);
            background-color: rgb(255, 65, 65);
        }

        /* plus sign */
        .sign {
            width: 100%;
            transition-duration: .3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .sign svg {
            width: 17px;
        }

        .sign svg path {
            fill: white;
        }

        /* text */
        .text {
            position: absolute;
            right: 0%;
            width: 0%;
            opacity: 0;
            color: white;
            font-size: 1em;
            font-weight: 600;
            transition-duration: .3s;
        }

        /* hover effect on button width */
        .Btn2:hover {
            width: 125px;
            border-radius: 40px;
            transition-duration: .3s;
        }

        .Btn2:hover .sign {
            width: 30%;
            transition-duration: .3s;
            padding-left: 20px;
        }

        /* hover effect button's text */
        .Btn2:hover .text {
            opacity: 1;
            width: 70%;
            transition-duration: .3s;
            padding-right: 10px;
        }

        /* button click effect*/
        .Btn2:active {
            transform: translate(2px, 2px);
        }
    </style>
</head>

<body style="background-color: #F4EEE0;">
    <!-- Navbar -->
    <?php include('navbar.php') ?>
    <!-- Hero Section -->
    <header class="hero text-white text-center py-5" style="background-image: url('image/th.jpg'); background-size: cover;">
        <div class="container">
            <h1 class="display-4" style="text-shadow: 2px 2px 4px #000000;">Welcome to Dasboard</h1>
            <p class="lead" style="text-shadow: 2px 2px 4px #000000;">#Pindah Ke Dasboard</p>
        </div>
    </header>
    <?php include('carousel.php'); ?>
    <!-- Add Bootstrap JS (Optional, if you want to use Bootstrap's JavaScript features) -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <div class="d-flex justify-content-center">
        <form id="logoutForm" action="login.php" method="post" class='ms-4 mb-3'>
            <button class="Btn2" type="submit" onclick="confirmLogout()" style="line-height: 1;">
                <div class="sign"><svg viewBox="0 0 512 512">
                        <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                    </svg></div>
                <div class="text">Logout</div>
            </button>
        </form>
    </div>
    <script type="text/javascript">
        function confirmLogout() {
            var result = confirm("Are you sure you want to logout?");
            if (result) {
                // Submit the logout form
                document.getElementById("logoutForm").submit();
            }
        }
    </script>
</body>

</html>
